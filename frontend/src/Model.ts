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

export class Model {
    public appState: ObservableField<AppState> = new ObservableField<AppState>(AppState.newSession);

    public soundType: ObservableField<SoundType> = new ObservableField<SoundType>(SoundType.bowl);
    public startAt: ObservableField<Date | null> = new ObservableField<Date | null>(null);
    public durationMins: ObservableField<number> = new ObservableField<number>(30);
    public intervalLen: ObservableField<number> = new ObservableField<number>(0);
    public intervalLenOptions: ObservableField<number[]> = new ObservableField<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    public startMeditateClicked: Event = new Event();
}