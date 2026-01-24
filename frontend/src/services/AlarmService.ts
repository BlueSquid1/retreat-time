import { AlarmDetail } from '../Model'


declare const Android: {
    scheduleAlarms: (jsonString: string) => void;
};

export class AlarmService {
    scheduleAlarms(alarmsDetails: AlarmDetail[]): boolean {
        const jsonString = JSON.stringify(alarmsDetails);
        Android.scheduleAlarms(jsonString);
        return true;
    }

    cancelPendingAlarms(alarmsDetails: AlarmDetail[]): boolean {
        return true;
    }
}