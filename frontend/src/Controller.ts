import { Model, Player } from './Model'


export class Controller {
    private model: Model;

    constructor(model: Model) {
        this.model = model;

        this.model.onSquareClick = (index: number) => { this.squareClickedOn(index) };
    }

    squareClickedOn(index: number) {
        this.model.squareValue[index].value = Player.player2;
    }
}