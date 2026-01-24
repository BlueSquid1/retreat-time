import { Model, AlarmDetail, AppState } from './Model'
import { AlarmService } from './services/AlarmService';

export class Presenter {
    private model: Model;
    private alarmService: AlarmService;

    constructor(model: Model) {
        this.model = model;

        this.alarmService = new AlarmService();

        this.model.startMeditateClicked.subscribe(() => { this.startMeditateClicked() });
        this.model.cancelMeditateClicked.subscribe(() => { this.cancelMeditationClicked() });
        this.model.durationMins.subscribe(() => { this.recalculateIntervalLengths() });

        // Set up recurring function call every 1 minute to recalculate remaining time
        setInterval(() => {
            this.recalculateTimers();
        }, 1000);
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
        let alarmDetails = this.model.getAllAlarms();

        this.alarmService.scheduleAlarms(alarmDetails);

        this.recalculateTimers();

        this.model.appState.value = AppState.currentSession;
    }

    cancelMeditationClicked() {
        let alarmDetails = this.model.getAllAlarms();
        this.alarmService.cancelPendingAlarms(alarmDetails);
        this.model.appState.value = AppState.newSession;
    }

    recalculateTimers() {
        const now = new Date();
        let upcomingAlarms = this.model.getUpcomingAlarms(now);
        if (upcomingAlarms.length < 1) {
            this.model.timeToAlarmMin.value = 0;
            this.model.remainingAlarms.value = 0;
            return;
        }

        const timeToAlarmMilliSec = upcomingAlarms[0].triggerAtEpoch - now.getTime();
        const timeToAlarmMin = Math.ceil((timeToAlarmMilliSec / 1000) / 60)
        this.model.timeToAlarmMin.value = timeToAlarmMin;
        this.model.remainingAlarms.value = upcomingAlarms.length - 1;
    }


}