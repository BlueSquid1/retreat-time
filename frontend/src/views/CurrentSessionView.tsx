import React from "react";
// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { useField } from "../DatabindingUtils";

import { AppState, Model } from "../Model"

export function CurrentSessionView({ model }: { model: Model }): any {
    const [_, setAppState] = useField(model.appState);
    const [endType, setEndType] = useField(model.endType);

    return (
        <div className="card-body">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => { setAppState(AppState.newSession) }}
                >
                    Back
                </button>
                <h3 className="mb-0">Advance Settings</h3>
            </div>

            {/* End */}
            <div className="mb-3">
                <label className="form-label">End</label>
                <select
                    className="form-select"
                // value={endType}
                // onChange={e => setEndType(e.target.value as EndType)}
                >
                    <option value="occurrences">After number of occurrences</option>
                    <option value="time">At end time</option>
                </select>
            </div>

            {/* Occurrences */}
            {'occurrences' === 'occurrences' && (
                <div className="mb-3">
                    <label className="form-label">Occurrences</label>
                    <input
                        type="number"
                        min={1}
                        className="form-control"
                        value="5"
                    // onChange={e => setOccurrences(Number(e.target.value))}
                    />
                </div>
            )}

            {/* End Time */}
            {/* {endType === 'time' && (
                <div className="mb-3">
                    <label className="form-label">End time</label>
                    <input
                        type="time"
                        className="form-control"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                    />
                </div>
            )} */}
        </div>
    );
}