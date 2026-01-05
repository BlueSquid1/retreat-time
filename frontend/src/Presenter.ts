import { Model, SoundType } from './Model'


export class Presenter {
    private model: Model;

    constructor(model: Model) {
        this.model = model;

        this.model.startMeditateClicked.subscribe(() => { this.startMeditateClicked() });
    }

    startMeditateClicked() {
        console.log(`interval: ${this.model.intervalMins.value}`);
        console.log(`alarm type: ${this.model.soundType.value}`);
        this.model.intervalMins.value = 10;
        this.model.soundType.value = SoundType.bowl;
    }
}