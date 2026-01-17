import { SoundType } from '../Model'

export class AlarmDetail {
    triggerAtEpoch: number = 0;
    sound: SoundType = SoundType.bowl;
}

declare const Android: {
    scheduleAlarms: (jsonString: string) => void;
};

export class AlarmService {
    scheduleAlarms(alarmsDetails: AlarmDetail[]): boolean {
        const jsonString = JSON.stringify(alarmsDetails);
        Android.scheduleAlarms(jsonString);
        return true;
    }
}