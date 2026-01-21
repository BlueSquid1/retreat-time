import { ObservableField, Event } from './DatabindingUtils';

type BlankSpaceType = "\u2060"
export let BLANK_SPACE: BlankSpaceType = "\u2060"

export enum SoundType {
    bowl = "bowl",
    wood = "wood",
    bell = "bell"
}

export enum AppState {
    newSession,
    currentSession
}

export enum EndType {
    occurances,
    endTime
}

export class AlarmDetail {
    triggerAtEpoch: number = 0;
    sound: SoundType = SoundType.bowl;
}

export class Model {
    public appState: ObservableField<AppState> = new ObservableField<AppState>(AppState.newSession);

    public soundType: ObservableField<SoundType> = new ObservableField<SoundType>(SoundType.bowl);
    public startAt: ObservableField<Date | null> = new ObservableField<Date | null>(null);
    public durationMins: ObservableField<number> = new ObservableField<number>(30);
    public intervalLen: ObservableField<number> = new ObservableField<number>(0);
    public intervalLenOptions: ObservableField<number[]> = new ObservableField<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    public startMeditateClicked: Event = new Event();
    public startedSessionAt: ObservableField<Date | null> = new ObservableField<Date | null>(null);

    isSameDay(timeStamp: Date, now: Date): boolean {
        if (timeStamp.getHours() > now.getHours()) {
            return true;
        } else if (timeStamp.getHours() < now.getHours()) {
            return false;
        } else {
            // Look at the minutes when in the same hour
            return (timeStamp.getMinutes() > now.getMinutes());
        }
    }

    fromHhmmToEpochDate(hhmmDate: Date, now: Date): Date {
        let epochDate: Date = new Date(now);
        if (!this.isSameDay(hhmmDate, now)) {
            // Next day - start at midnight
            epochDate.setDate(now.getDate() + 1);
            epochDate.setHours(0, 0, 0, 0);
        }

        epochDate.setHours(hhmmDate.getHours(), hhmmDate.getMinutes(), 0, 0);
        return epochDate;
    }

    getUpcomingAlarms(): AlarmDetail[] {
        const startSessionAt = this.startedSessionAt.value;
        if (startSessionAt === null) {
            return [];
        }

        // Convert from hh:mm to epoch time stamps
        let startEpochMilliSec = new Date().getTime();
        const hhmmDate: Date | null = this.startAt.value;
        if (hhmmDate !== null) {
            startEpochMilliSec = this.fromHhmmToEpochDate(hhmmDate, startSessionAt).getTime();
        }

        let alarmsDetails: AlarmDetail[] = [];

        // Calculate interval alarms
        const totalDurationMilliSec = this.durationMins.value * 60 * 1000;
        const endEpochMilliSec = startEpochMilliSec + totalDurationMilliSec;
        if (this.intervalLen.value > 0) {
            let intervalLenMilliSec = (this.intervalLen.value * 1000 * 60);
            let intervalEpoch = startEpochMilliSec + intervalLenMilliSec;
            while (intervalEpoch < endEpochMilliSec) {
                let intervalAlarm = new AlarmDetail();
                intervalAlarm.triggerAtEpoch = intervalEpoch;
                intervalAlarm.sound = this.soundType.value;
                alarmsDetails.push(intervalAlarm);
                intervalEpoch += intervalLenMilliSec;
            }
        }

        // Calculate final alarm
        let finalAlarm = new AlarmDetail();
        finalAlarm.triggerAtEpoch = endEpochMilliSec;
        finalAlarm.sound = this.soundType.value;
        alarmsDetails.push(finalAlarm);
        return alarmsDetails;
    }
}