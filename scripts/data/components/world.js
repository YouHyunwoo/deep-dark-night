import { Component } from '../../component.js';
import { TimeSystem } from './systems.js';
import { GameObject } from '../../object.js';
import { Map } from './map.js';



export class World extends Component {
    constructor(name, game) {
        super(name);

        this.game = game;

        this.systems = [];
        this.maps = [];
    }

    onInitialize() {
        this.timeSystem = new TimeSystem();
        
        this.#addSystems(this.timeSystem);


        const map = this.#generateSimpleMap();

        this.maps.push(map);
    }

    #addSystems(...systems) {
        this.systems.concat(systems);
    }

    #generateSimpleMap() {
        const map = new GameObject('map');

        const mapComponent = new Map('Map', this);

        map.addComponents(mapComponent);

        map.init();

        return map;
    }

    onUpdate(timeDelta) {
        this.systems.forEach(system => system.update(timeDelta));
        this.maps.forEach(map => map.update(timeDelta));
    }

    onDraw(context) {
        this.maps.forEach(map => map.draw(context));

        if (this.timeSystem.isNight()) {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.game.engine.canvas.width, this.game.engine.canvas.height);
        }
    }
}

