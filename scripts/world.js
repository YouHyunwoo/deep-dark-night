import { Stone } from "./data/objects.js";
import { TimeSystem } from "./system.js";



export class World {
    constructor(game) {
        this.game = game;

        this.systems = [];
        this.maps = [];
    }

    init() {
        this.timeSystem = new TimeSystem();

        this.systems.push(this.timeSystem);
    }

    update(timeDelta) {
        this.systems.forEach(system => system.update(timeDelta));
        this.maps.forEach(map => map.update(timeDelta));
    }

    draw(context) {
        this.maps.forEach(map => map.draw(context));

        if (this.timeSystem.isNight()) {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.game.engine.canvas.width, this.game.engine.canvas.height);
        }
    }
}

export class Map {
    constructor(world) {
        this.world = world;

        this.width = 800;
        this.height = 800;

        this.backgroundColor = 'saddlebrown';

        this.ground = [];
        this.sky = [];

        this.environments = {
            ground: null
        };
    }

    init() {
        this.generateObjects(10);
        this.generateEnvironments();
    }

    generateObjects(count) {
        for (let i = 0; i < count; i++) {
            const obj = new Stone('stone');
            obj.init();

            obj.map = this;

            obj.x = Math.random() * this.world.game.engine.canvas.width;
            obj.y = Math.random() * this.world.game.engine.canvas.height;

            const scale = Math.random() * 0.5 + 0.5;

            obj.findComponents('SpriteRenderer')[0].sprite.scale = [scale, scale];

            this.ground.push(obj);
        }
    }

    generateEnvironments() {

    }

    removeGameObject(obj) {
        let index = this.ground.indexOf(obj);

        if (index >= 0) {
            this.ground.splice(index, 1);
        }

        index = this.sky.indexOf(obj);

        if (index >= 0) {
            this.sky.splice(index, 1);
        }
    }

    update(timeDelta) {
        if (Math.random() > 0.99) {
            this.generateObjects(1);
        }

        this.ground = this.ground.sort((a, b) => a.y - b.y);
    }

    draw(context) {
        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.height);

        this.ground.forEach(obj => {
            obj.draw(context);
        });

        this.sky.forEach(obj => {
            obj.draw(context);
        })

        context.restore();
    }
}