import { Scene } from './scene.js';



export class Game {
    constructor(engine) {
        this.engine = engine;

        this.scene = new Scene(this);
    }

    init() {}

    dispose() {}

    event(events) {
        this.scene.event(events);
    }

    update(timeDelta) {
        this.scene.update(timeDelta);
    }

    draw(context) {
        this.scene.draw(context);
    }
}