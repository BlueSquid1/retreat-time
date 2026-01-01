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