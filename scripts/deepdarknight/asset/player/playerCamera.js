import { Component } from '../../../engine/game/component.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';



export class PlayerCamera extends Component {
    onInitialize() {
        const player = this.gameObject;

        this.player = player;

        const layer = player.owner;
        const map = layer.owner;

        this.map = map;

        const scene = player.scene;

        this.scene = scene;

        const canvas = scene.game.engine.canvas;

        this.canvas = canvas;
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
                camera.area.x = Math.floor(this.player.area.x);
                camera.area.x = Math.max(Math.floor(sizeCamera.x / 2), Math.min(camera.area.x, sizeMap.x - Math.floor(sizeCamera.x / 2)));
            }
            
            if (sizeMap.y <= sizeCamera.y) {
                camera.area.y = Math.floor(sizeMap.y / 2);
            }
            else {
                camera.area.y = Math.floor(this.player.area.y);
                camera.area.y = Math.max(Math.floor(sizeCamera.y / 2), Math.min(camera.area.y, sizeMap.y - Math.floor(sizeCamera.y / 2)));
            }
        }
    }
}