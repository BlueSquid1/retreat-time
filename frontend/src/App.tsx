import React, { useState, StrictMode } from 'react'
import { Board } from './components/Board'

import { useField } from "./useField";

import { Model, PlayerNullable } from './Model'
import { Controller } from './Controller'

let model = new Model()
let controller = new Controller(model)

export function App() {
    const squareValues: PlayerNullable[] = new Array(9).fill("");
    [squareValues[0]] = useField(model.squareValue[0]);
    [squareValues[1]] = useField(model.squareValue[1]);
    [squareValues[2]] = useField(model.squareValue[2]);
    [squareValues[3]] = useField(model.squareValue[3]);
    [squareValues[4]] = useField(model.squareValue[4]);
    [squareValues[5]] = useField(model.squareValue[5]);
    [squareValues[6]] = useField(model.squareValue[6]);
    [squareValues[7]] = useField(model.squareValue[7]);
    [squareValues[8]] = useField(model.squareValue[8]);

    return (
        <Board squareValues={squareValues} onSquareClick={model.onSquareClick} />
    );
}