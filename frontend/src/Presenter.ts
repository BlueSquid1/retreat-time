import { Model, SoundType } from './Model'
import { AlarmService, AlarmDetail } from './services/AlarmService';

export class Presenter {
    private model: Model;

    constructor(model: Model) {
        this.model = model;

        this.model.startMeditateClicked.subscribe(() => { this.startMeditateClicked() });
        this.model.durationMins.subscribe(() => { this.recalculateIntervalLengths() });
    }

    recalculateIntervalLengths() {
        const newDuration: number = this.model.durationMins.value;
        const newIntervalOptions: number[] = [];
        for (let i = 1; i <= Math.floor(newDuration / 2); i++) {
            newIntervalOptions.push(i);
        }
        this.model.intervalLenOptions.value = newIntervalOptions;
    }

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

    startMeditateClicked() {
        // Get time now
        const now = new Date();

        // Convert from hh:mm to epoch time stamps
        let startEpochMilliSec = new Date().getTime();
        const hhmmDate: Date | null = this.model.startAt.value;
        if (hhmmDate !== null) {
            startEpochMilliSec = this.fromHhmmToEpochDate(hhmmDate, now).getTime();
        }

        let alarmsDetails: AlarmDetail[] = [];

        // Calculate interval alarms
        const totalDurationMilliSec = this.model.durationMins.value * 60 * 1000;
        const endEpochMilliSec = startEpochMilliSec + totalDurationMilliSec;
        if (this.model.intervalLen.value > 0) {
            let intervalEpoch = startEpochMilliSec;
            while (intervalEpoch < endEpochMilliSec) {
                let intervalAlarm = new AlarmDetail();
                intervalAlarm.triggerAtEpoch = intervalEpoch;
                intervalAlarm.sound = this.model.soundType.value;
                alarmsDetails.push(intervalAlarm);
                intervalEpoch += (this.model.intervalLen.value * 1000);
            }
        }

        // Calculate final alarm
        let finalAlarm = new AlarmDetail();
        finalAlarm.triggerAtEpoch = endEpochMilliSec;
        finalAlarm.sound = this.model.soundType.value;
        alarmsDetails.push(finalAlarm);


        const alarmService = new AlarmService();
        alarmService.scheduleAlarms(alarmsDetails);
    }
}