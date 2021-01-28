import { Stone } from "./object.js";

export class World {
    constructor(game) {
        this.game = game;

        this.maps = [];
    }

    update(timeDelta) {
        this.maps.forEach(map => map.update(timeDelta));
    }

    draw(context) {
        this.maps.forEach(map => map.draw(context));
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

        this.init();
    }

    init() {
        this.generateObjects(10);
        this.generateEnvironments();
    }

    generateObjects(count) {
        for (let i = 0; i < count; i++) {
            const obj = new Stone('stone');

            obj.map = this;

            obj.x = Math.random() * this.world.game.canvas.width;
            obj.y = Math.random() * this.world.game.canvas.height;

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