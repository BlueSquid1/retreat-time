import { ObservableField, Event } from './DatabindingUtils';

type BlankSpaceType = "\u2060"
export let BLANK_SPACE: BlankSpaceType = "\u2060"

export enum SoundType {
    bowl,
    wood,
    bell
}

export class Model {
    public intervalMins: ObservableField<number> = new ObservableField<number>(30);
    public soundType: ObservableField<SoundType> = new ObservableField<SoundType>(SoundType.wood);
    public startMeditateClicked: Event = new Event();
}