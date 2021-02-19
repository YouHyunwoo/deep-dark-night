import { Event } from '../util/event.js';



export class Component {
    constructor() {
        this._states = {
            created: 0,
            initialized: 1,
            disposed: 2,
        };
        this._state = 0;

        this.gameObject = null;

        this.enable = true;
        this.events = new Event();
    }

    init() {
        if (this._state === this._states.created) {
            this.onInitialize();

            this._state = this._states.initialized;
        }
    }

    dispose() {
        if (this._state === this._states.initialized) {
            this.onDispose();

            this._state = this._states.disposed;
        }
    }

    event(events) {
        if (this._state === this._states.initialized && this.enable) {
            this.onEvent(events);
        }
    }

    update(timeDelta) {
        if (this._state === this._states.initialized && this.enable) {
            this.onUpdate(timeDelta);
        }
    }

    draw(context) {
        if (this._state === this._states.initialized && this.enable) {
            this.onDraw(context);
        }
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}