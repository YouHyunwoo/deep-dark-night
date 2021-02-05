import { Vector2 } from '../math/geometry/vector.js';



export class Camera {
    constructor() {
        this.position = Vector2.zeros();
    }

    screenToWorld(positionInScreen) {
        return positionInScreen.add(this.position);
    }

    worldToScreen(positionInWorld) {
        return positionInWorld.subtract(this.position);
    }
}