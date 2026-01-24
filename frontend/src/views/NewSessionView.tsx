import React from "react";
// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { useField } from "../DatabindingUtils";

import { Model, SoundType } from "../Model"

export function NewSessionView({ model }: { model: Model }): any {
    const [startAt, setStartAt] = useField(model.startAt);
    const [durationMins, setDurationMins] = useField(model.durationMins);
    const [soundType, setSoundType] = useField(model.soundType);
    const [intervalLen, setIntervalLen] = useField(model.intervalLen);
    const [intervalLenOptions] = useField(model.intervalLenOptions);

    function DateToHHMM(date: Date | null): string {
        if (date === null) {
            return "";
        }
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function HHMMToDate(time: string): Date | null {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date(0);
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    return (
        <div className="card-body">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">New Meditation Session</h3>
                <button className="btn btn-success" onClick={() => { model.startMeditateClicked.invoke() }}>
                    Start
                </button>
            </div>

            {/* Bell Selection */}
            <div className="mb-3">
                <label className="form-label">Alarm sound:</label>
                <div>
                    {([SoundType.bowl, SoundType.wood, SoundType.bell] as SoundType[]).map(type => (
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                className="btn-check"
                                name="bell"
                                id={`bell-${type}`}
                                checked={soundType === type}
                                onChange={() => setSoundType(type)}
                            />
                            <label className="btn btn-primary" htmlFor={`bell-${type}`}>
                                {type}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Start at */}
            <div className="mb-3">
                <label className="form-label">Start at:</label>
                <div className="d-flex gap-2">
                    <input
                        type="time"
                        className="form-control"
                        step="60"
                        value={DateToHHMM(startAt)}
                        onChange={e => setStartAt(HHMMToDate(e.target.value))}
                    />
                </div>
            </div>

            {/* Length */}
            <div className="mb-3">
                <label className="form-label">Total Duration (mins):</label>
                <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-control"
                    value={durationMins}
                    onChange={e => setDurationMins(Number(e.target.value))}
                />
            </div>

            {/* Intervals */}
            <div className="mb-3">
                <label htmlFor="sessionType" className="form-label">Intervals:</label>

                <select
                    id="sessionType"
                    className="form-select"
                    value={intervalLen}
                    onChange={(e) => setIntervalLen(Number(e.target.value))}
                >
                    <option value="0">No Intervals</option>

                    {intervalLenOptions.map((option) => (
                        <option value={option}>{option} min intervals</option>
                    ))}
                </select>
            </div>
        </div>
    );
}