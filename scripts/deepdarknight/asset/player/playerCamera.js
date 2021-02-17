import { Component } from '../../../engine/game/component.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';



export class PlayerCamera extends Component {
    onInitialize() {
        const player = this.owner;

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
            const sizeCanvas = new Vector2(this.canvas.width, this.canvas.height);
            const sizeMap = this.map.area.getSize();

            if (sizeMap.x <= sizeCanvas.x) {
                camera.area.x = Math.floor(sizeMap.x / 2);
            }
            else {
                camera.area.x = Math.floor(this.player.area.x - Math.floor(this.canvas.width / 2));
            }
            
            if (sizeMap.y <= sizeCanvas.y) {
                camera.area.y = Math.floor(sizeMap.y / 2);
            }
            else {
                camera.area.y = Math.floor(this.player.area.y - Math.floor(this.canvas.height / 2));
            }
        }
    }
}