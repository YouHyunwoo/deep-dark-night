import { Camera } from './camera.js';
import { Scene } from './core/scene.js';



export class Game {
    constructor(engine) {
        this.engine = engine;

        this.scene = new Scene(this);

        this.camera = new Camera();
    }

    init() {}

    dispose() {}

    update(timeDelta) {
        this.scene.update(timeDelta);
    }

    draw(context) {
        context.save();

        context.translate(-this.camera.x, -this.camera.y);

        this.scene.draw(context);

        context.restore();
    }
}