import { Component } from '../../../engine/game/component.js';



export class ObjectSort extends Component {
    onInitialize() {
        const object = this.gameObject;
        const layers = object.objects;

        this.object = object;
        this.layers = layers;
    }

    onUpdate(timeDelta) {
        this.layers.forEach(layer => {
            layer.objects = layer.objects.sort((a, b) => {
                return a.area.y - b.area.y;
            });
        });
    }
}