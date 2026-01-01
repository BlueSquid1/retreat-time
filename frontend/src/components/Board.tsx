import React from "react";

// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { Square } from './Square';
import { PlayerNullable } from '../Model';

export function Board({ squareValues, onSquareClick }: { squareValues: PlayerNullable[], onSquareClick: (index: number) => void }): any {

    return (
        <div className="container text-center">
            <div className="row">
                <Square className="col" squareValue={squareValues[0]} onClick={() => { onSquareClick(0) }} />
                <Square className="col" squareValue={squareValues[1]} onClick={() => { onSquareClick(1) }} />
                <Square className="col" squareValue={squareValues[2]} onClick={() => { onSquareClick(2) }} />
            </div>
            <div className="row">
                <Square className="col" squareValue={squareValues[3]} onClick={() => { onSquareClick(3) }} />
                <Square className="col" squareValue={squareValues[4]} onClick={() => { onSquareClick(4) }} />
                <Square className="col" squareValue={squareValues[5]} onClick={() => { onSquareClick(5) }} />
            </div>
            <div className="row">
                <Square className="col" squareValue={squareValues[6]} onClick={() => { onSquareClick(6) }} />
                <Square className="col" squareValue={squareValues[7]} onClick={() => { onSquareClick(7) }} />
                <Square className="col" squareValue={squareValues[8]} onClick={() => { onSquareClick(8) }} />
            </div>
        </div>
    );
}