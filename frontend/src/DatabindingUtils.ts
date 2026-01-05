import { useSyncExternalStore, useCallback } from "react";

export class Event {
    private listeners = new Set<() => void>();
    subscribe(cb: () => void) {

        this.listeners.add(cb);
        return () => this.listeners.delete(cb); // unsubscribe
    }
    invoke() {
        this.listeners.forEach(cb => cb());
    }
}

export class ObservableField<T> {
    private _value: T;
    private listeners = new Set<() => void>();

    constructor(initial: T) {
        this._value = initial;
    }

    get value() {
        return this._value;
    }

    set value(v: T) {
        if (v === this._value) return;
        this._value = v;
        this.listeners.forEach(cb => cb());
    }

    subscribe(cb: () => void) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb); // unsubscribe
    }
}

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