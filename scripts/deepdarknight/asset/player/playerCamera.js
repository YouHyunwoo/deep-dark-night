import { Component } from '../../../engine/game/component.js';



export class PlayerCamera extends Component {
    onInitialize() {
        this.map = this.gameObject.parent.parent;
        this.scene = this.gameObject.scene;
        this.canvas = this.gameObject.scene.game.engine.canvas;
    }

    onUpdate(timeDelta) {
        const camera = this.scene.camera;

        if (camera) {
            const sizeCamera = camera.area.getSize();
            const sizeMap = this.map.area.getSize();

            if (sizeMap.x <= sizeCamera.x) {
                camera.area.x = Math.floor(sizeMap.x / 2);
            }
            else {
                camera.area.x = Math.floor(this.gameObject.area.x);
                camera.area.x = Math.max(Math.floor(sizeCamera.x / 2), Math.min(camera.area.x, sizeMap.x - Math.floor(sizeCamera.x / 2)));
            }
            
            if (sizeMap.y <= sizeCamera.y) {
                camera.area.y = Math.floor(sizeMap.y / 2);
            }
            else {
                camera.area.y = Math.floor(this.gameObject.area.y);
                camera.area.y = Math.max(Math.floor(sizeCamera.y / 2), Math.min(camera.area.y, sizeMap.y - Math.floor(sizeCamera.y / 2)));
            }
        }
    }
}