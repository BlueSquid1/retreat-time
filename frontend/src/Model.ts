import { ObservableField } from './ObservableField';

type BlankSpaceType = "\u2060"
export let BLANK_SPACE: BlankSpaceType = "\u2060"

export enum Player {
    player1 = 'X',
    player2 = 'O'
}

export type PlayerNullable = Player | BlankSpaceType;

export class Model {
    public curPlayer: ObservableField<Player> = new ObservableField<Player>(Player.player1);
    public squareValue: ObservableField<PlayerNullable>[] = Array.from({ length: 9 }, () => new ObservableField<PlayerNullable>(BLANK_SPACE));
    public onSquareClick: (index: number) => void;
}