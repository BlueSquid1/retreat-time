import { Model, SoundType } from './Model'
import { TimeManager } from './TimeManager';

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

    startMeditateClicked() {
        console.log(`Length: ${this.model.durationMins.value}`);
        const timeMgr = new TimeManager();
        timeMgr.scheduleAlarm(this.model.startAt.value);
    }
}