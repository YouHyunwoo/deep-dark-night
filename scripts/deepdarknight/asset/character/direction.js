import { Component } from '../../../engine/game/component.js';



export class Direction extends Component {
    constructor(name) {
        super(name);

        this.direction = null;
    }

    onInitialize() {
        this.direction = this.direction ?? 'down';
    }
}