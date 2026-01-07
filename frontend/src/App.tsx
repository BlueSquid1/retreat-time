import { NewSessionView } from './views/NewSessionView'
import { AdvanceSessionView } from './views/AdvanceSessionView'

import { AppState, Model } from "./Model"
import { Presenter } from "./Presenter"
import { useField } from './DatabindingUtils';

let model = new Model();
let presenter = new Presenter(model);

export function App() {
    const [appState] = useField(model.appState);
    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                {appState === AppState.newSession && (
                    <NewSessionView model={model} />
                )}
                {appState === AppState.AdvanceSession && (
                    <AdvanceSessionView model={model} />
                )}
            </div>
        </div>
    );
}