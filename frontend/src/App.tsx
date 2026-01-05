import { NewSessionView } from './NewSessionView'

import { Model } from "./Model"
import { Presenter } from "./Presenter"

let model = new Model();
let presenter = new Presenter(model);

export function App() {
    return (
        <NewSessionView model={model} />
    );
}