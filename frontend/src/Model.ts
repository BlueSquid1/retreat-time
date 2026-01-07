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
    AdvanceSession,
    currentSession
}

export class Model {
    public appState: ObservableField<AppState> = new ObservableField<AppState>(AppState.newSession);
    public soundType: ObservableField<SoundType> = new ObservableField<SoundType>(SoundType.wood);
    public startAt: ObservableField<Date> = new ObservableField<Date>(new Date());
    public durationMins: ObservableField<number> = new ObservableField<number>(30);
    public startMeditateClicked: Event = new Event();
}