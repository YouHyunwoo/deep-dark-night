import { GameObject } from './object.js';



export class Camera extends GameObject {
    screenToWorld(positionInScreen) {
        return positionInScreen.add(this.area.getPosition());
    }

    worldToScreen(positionInWorld) {
        return positionInWorld.subtract(this.area.getPosition());
    }
}