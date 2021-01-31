import { Component } from '../../engine/game/component.js';
import { containsArea } from '../../engine/math/geometry/area.js';
import { Stone } from '../objects.js';



export class Map extends Component {
    constructor(name, world) {
        super(name);

        this.world = world;

        this.width = 800;
        this.height = 800;

        this.backgroundColor = 'saddlebrown';

        // this.layers = [
        //     { id: 'ground', objects: [] },
        //     { id: 'sky', objects: [] },
        // ];

        this.ground = [];
        this.sky = [];

        this.environments = {
            ground: null
        };
    }

    onInitialize() {
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

    onUpdate(timeDelta) {
        if (Math.random() > 0.99) {
            this.generateObjects(1);
        }

        this.ground = this.ground.sort((a, b) => a.y - b.y);
    }

    onDraw(context) {
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

    findGameObjectPointingByMouse(mousePosition, exceptions) {
        let result = null;

        const camera = this.world.game.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        const layers = [ this.ground, this.sky ];

        layers.reverse().forEach(layer => {
            layer.reverse().forEach(obj => {
                if (result && exceptions.includes(obj)) {
                    return;
                }
    
                const area = obj.findComponents('SpriteRenderer')[0].getSpriteArea();
                const areaInWorld = [
                    ...obj.localToGlobal(area.slice(0, 2)),
                    ...area.slice(2)
                ];
    
                if (containsArea(areaInWorld, mouseInWorld)) {
                    result = obj;
                }
            })
        });

        return result;
    }
}