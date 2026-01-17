import { Model, SoundType } from './Model'
import { AlarmService, AlarmDetail } from './services/AlarmService';

export class Presenter {
    private model: Model;

    constructor(model: Model) {
        this.model = model;

        this.model.startMeditateClicked.subscribe(() => { this.startMeditateClicked() });
        this.model.durationMins.subscribe(() => { this.recalculateIntervalLengths() })
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

    convertFromHhmmToEpoch(hhmmDate: Date, now: Date): Date {
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
        let alarmsDetails: AlarmDetail[] = [];

        const now = new Date();

        // Calculate interval alarms
        if (this.model.intervalLen.value > 0) {
            // TODO
        }

        // Calculate final alarm
        let finalAlarm = new AlarmDetail();

        // Convert from hh:mm to epoch time stamps
        const hhmmDate = this.model.startAt.value;
        finalAlarm.triggerAtEpoch = this.convertFromHhmmToEpoch(hhmmDate, now).getTime();
        finalAlarm.sound = this.model.soundType.value;

        alarmsDetails.push(finalAlarm);


        const alarmService = new AlarmService();
        alarmService.scheduleAlarms(alarmsDetails);
    }
}