export class TimeManager {
    scheduleAlarm(timeStamp: Date): boolean {
        const hours = timeStamp.getHours();
        const mins = timeStamp.getMinutes();
        Android.scheduleAlarm();
        return true;
    }
}