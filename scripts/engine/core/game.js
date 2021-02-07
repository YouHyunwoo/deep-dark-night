import { Camera } from '../game/camera.js';
import { Scene } from './scene.js';



export class Game {
    constructor(engine) {
        this.engine = engine;

        this.scene = new Scene(this);

        this.camera = new Camera();
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
        context.save();

        context.translate(-this.camera.position.x, -this.camera.position.y);

        this.scene.draw(context);

        context.restore();
    }
}