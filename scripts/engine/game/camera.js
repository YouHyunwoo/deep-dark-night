import { Vector2 } from '../math/geometry/vector.js';
import { GameObject } from './object.js';



export class Camera extends GameObject {
    onInitialize() {
        this.engine = this.scene.game.engine;
    }

    get scale() {
        const sizeCanvas = new Vector2(this.engine.canvas.width, this.engine.canvas.height);
        const sizeCamera = this.area.getSize();

        const scale = sizeCanvas.divideEach(sizeCamera);

        return scale;
    }

    screenToWorld(positionInScreen) {
        const sizeCanvas = new Vector2(this.engine.canvas.width, this.engine.canvas.height);
        const sizeCamera = this.area.getSize();

        const positionInViewport = positionInScreen.divideEach(sizeCanvas);
        const centerInViewport = positionInViewport.subtract(Vector2.full(0.5));
        const positionInCamera = centerInViewport.multiplyEach(sizeCamera);

        const positionInWorld = positionInCamera.add(this.area.getPosition());

        return positionInWorld;
    }

    worldToScreen(positionInWorld) {
        const sizeCanvas = new Vector2(this.engine.canvas.width, this.engine.canvas.height);
        const sizeCamera = this.area.getSize();

        const positionInCamera = positionInWorld.subtract(this.area.getPosition());
        const centerInViewport = positionInCamera.divideEach(sizeCamera);
        const positionInViewport = centerInViewport.add(Vector2.full(0.5));

        const positionInScreen = positionInViewport.multiplyEach(sizeCanvas);

        return positionInScreen;
    }
}