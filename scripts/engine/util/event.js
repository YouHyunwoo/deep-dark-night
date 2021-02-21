export class Event {
    constructor() {
        this._events = {};
    }

    addListener(event, listener, once=false) {
        if (listener) {
            if (!(event in this._events)) {
                this._events[event] = [];
            }

            const listeners = this._events[event];

            listeners.push([listener, once]);
        }
    }

    removeListener(event, listener) {
        const listeners = this._events[event];

        if (listeners) {
            if (listener) {
                const index = listeners.map(listener => listener[0]).indexOf(listener);

                if (index >= 0) {
                    listeners.splice(index, 1);
                }

                if (listeners.length === 0) {
                    delete this._events[event];
                }
            }
            else {
                delete this._events[event];
            }
        }
    }

    notify(event, ...args) {
        const listeners = this._events[event];

        if (listeners) {
            listeners.forEach(listener => {
                listener[0](...args);
            });

            this._events[event] = listeners.filter(listener => !listener[1]);
        }
    }
}