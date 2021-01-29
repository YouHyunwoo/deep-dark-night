import { Engine } from './engine.js';
import { Game } from './game.js';
import { World, Map } from './world.js';
import { Player } from './player.js';



class DeepDarkNight extends Game {
    constructor(engine) {
        super(engine);

        this.world = null;
        this.player = null;
    }

    init() {
        this.world = new World(this);
        this.world.init();

            const map = new Map(this.world);

            map.init();
        
                this.player = new Player(this);
                this.player.map = map;

            map.ground.push(this.player.object);

        this.world.maps.push(map);
    }

    update(timeDelta) {
        this.world.update(timeDelta);
        this.player.update(timeDelta);
    }

    draw(context) {
        this.world.draw(context);
        this.player.draw(context);
    }
}


const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

engine.start();