import { Component } from '../../../engine/game/component.js';



export class World extends Component {
    constructor() {
        super();

        this.maps = [];
    }

    onUpdate(timeDelta) {
        this.maps.forEach(map => map.update(timeDelta));
    }

    onDraw(context) {
        this.maps.forEach(map => map.draw(context));
    }
}

