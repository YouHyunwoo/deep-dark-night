import { Component } from '../../../engine/game/component.js';



export class PlayerCamera extends Component {
    onInitialize() {
        const player = this.owner;

        this.player = player;

        const scene = this.owner.scene;

        this.scene = scene;

        const canvas = scene.game.engine.canvas;

        this.canvas = canvas;
    }

    onUpdate(timeDelta) {
        const camera = this.scene.camera;

        if (camera) {
            camera.area.x = Math.floor(this.player.area.x - Math.floor(this.canvas.width / 2));
            camera.area.y = Math.floor(this.player.area.y - Math.floor(this.canvas.height / 2));
        }
    }
}