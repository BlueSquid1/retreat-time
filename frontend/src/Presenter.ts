import { Model, AlarmDetail } from './Model'
import { AlarmService } from './services/AlarmService';

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



    startMeditateClicked() {
        this.model.startedSessionAt.value = new Date();
        let alarmDetails = this.model.getUpcomingAlarms();

        const alarmService = new AlarmService();
        alarmService.scheduleAlarms(alarmDetails);
    }
}