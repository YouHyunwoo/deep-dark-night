import { Component } from '../../../engine/game/component.js';



export class Direction extends Component {
    constructor() {
        super();

        this.direction = null;
    }

    onInitialize() {
        this.direction = this.direction ?? 'down';
    }
}