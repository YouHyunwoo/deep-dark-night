import { Event } from '../util/event.js';



export class Component {
    constructor(name) {
        this.owner = null;

        this._state = 'created';

        this.name = name ?? this.constructor.name;
        this.enable = true;
        this.events = new Event();
    }

    init() {
        if (this._state === 'created') {
            this.onInitialize();

            this._state = 'initialized';
        }
    }

    dispose() {
        if (this._state === 'initialized') {
            this.onDispose();

            this._state = 'disposed';
        }
    }

    event(events) {
        if (this._state === 'initialized' && this.enable) {
            this.onEvent(events);
        }
    }

    update(timeDelta) {
        if (this._state === 'initialized' && this.enable) {
            this.onUpdate(timeDelta);
        }
    }

    draw(context) {
        if (this._state === 'initialized' && this.enable) {
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