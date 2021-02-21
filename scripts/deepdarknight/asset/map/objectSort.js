import { Component } from '../../../engine/game/component.js';



export class ObjectSort extends Component {
    onInitialize() {
        this.layers = this.gameObject.gameObjects;
    }

    onUpdate(timeDelta) {
        this.layers.forEach(layer => {
            layer.gameObjects = layer.gameObjects.sort((a, b) => {
                return a.area.y - b.area.y;
            });
        });
    }
}