import { useSyncExternalStore, useCallback } from "react";
import { ObservableField } from "./ObservableField";

export function useField<T>(field: ObservableField<T>): [T, (v: T) => void] {
    const value = useSyncExternalStore(
        (cb) => field.subscribe(cb),
        () => field.value
    );

    const setValue = useCallback(
        (v: T) => {
            field.value = v;
        },
        [field]
    );

    return [value, setValue];
}