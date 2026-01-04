import React from "react";

// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { Model } from "./Model"
import { Controller } from "./Controller"

let model = new Model()
let controller = new Controller(model)

export function NewSession(): any {
    return (
        <>
            <h1>New Session</h1>
            <label htmlFor="bell-select">Bell:</label>
            <select name="bellType" id="bell-select">
                <option value="bowl">bowl</option>
                <option value="wood">wood</option>
                <option value="bell">bell</option>
            </select>
        </>
    );
}