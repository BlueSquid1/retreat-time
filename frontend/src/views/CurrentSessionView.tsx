import React from "react";
// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { useField } from "../DatabindingUtils";

import { AppState, Model } from "../Model"

export function CurrentSessionView({ model }: { model: Model }): any {
    const [timeToNextAlarm] = useField(model.timeToAlarmMin);
    const [remainingAlarms] = useField(model.remainingAlarms);


    return (
        <div className="card-body">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => { model.cancelMeditateClicked.invoke() }}
                >
                    Back
                </button>
                <h3 className="mb-0">Current Session</h3>
            </div>

            {/* Time to next alarm */}
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center mb-4">
                    <p className="mb-2">Time to next alarm:</p>
                    <h1 className="display-4">{timeToNextAlarm} mins</h1>
                </div>

                {/* Alarms remaining */}
                <div className="text-center">
                    <p className="mb-0">{remainingAlarms} alarms remaining</p>
                </div>
            </div>
        </div>
    );
}