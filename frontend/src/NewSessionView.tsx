import { useField } from "./DatabindingUtils";

// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { Model, SoundType } from "./Model"

export function NewSessionView({ model }: { model: Model }): any {
    const [intervalMins, setIntervalMins] = useField(model.intervalMins);
    const [soundType, setSoundType] = useField(model.soundType);

    return (
        <>
            <h1>New Session</h1>

            <p className="form-label">
                Sound:
                <input type="radio" id="bowl" name="alarmType" className="btn-check" checked={soundType === SoundType.bowl} onChange={(e) => { setSoundType(SoundType.bowl) }} />
                <label htmlFor="bowl" className="btn">Bowl</label>

                <input type="radio" id="wood" name="alarmType" className="btn-check" checked={soundType === SoundType.wood} onChange={(e) => { setSoundType(SoundType.wood) }} />
                <label htmlFor="wood" className="btn">Wood</label>

                <input type="radio" id="bell" name="alarmType" className="btn-check" checked={soundType === SoundType.bell} onChange={(e) => { setSoundType(SoundType.bell) }} />
                <label htmlFor="bell" className="btn">Bell</label>
            </p>

            <label className="form-label" htmlFor="duration">Duration: </label>
            <input id="duration" type="number" className="form-control" value={intervalMins} onChange={e => setIntervalMins(parseInt(e.target.value))} />
            <button className="btn btn-primary" onClick={() => { model.startMeditateClicked.invoke() }}>Start</button>
        </>
    );
}