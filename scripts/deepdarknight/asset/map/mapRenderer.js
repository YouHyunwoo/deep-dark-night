import { Component } from '../../../engine/game/component.js';



export class MapRenderer extends Component {
    constructor() {
        super();

        this.backgroundColor = 'white';
    }

    onInitialize() {
        const object = this.owner;

        this.object = object;
    }

    onDraw(context) {
        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(...this.object.area.toList());

        context.restore();
    }
}