export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    screenToWorld(positionInScreen) {
        return [positionInScreen[0] + this.x, positionInScreen[1] + this.y];
    }
}