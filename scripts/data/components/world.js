import { Component } from '../../engine/game/component.js';
import { GameObject } from '../../engine/game/object.js';
import { Map } from './map.js';



export class World extends Component {
    constructor(name, game) {
        super(name);

        this.game = game;

        this.maps = [];
    }

    onInitialize() {
        const map = this.#generateSimpleMap();

        this.maps.push(map);
    }

    #generateSimpleMap() {
        const map = new GameObject('map');

        const mapComponent = new Map('Map', this);

        map.addComponents(mapComponent);

        map.init();

        return map;
    }

    onUpdate(timeDelta) {
        this.maps.forEach(map => map.update(timeDelta));
    }

    onDraw(context) {
        this.maps.forEach(map => map.draw(context));
    }
}

