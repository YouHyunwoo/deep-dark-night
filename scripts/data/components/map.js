import { Component } from '../../engine/game/component.js';
import { Area } from '../../engine/math/geometry/area.js';
import { Vector2 } from '../../engine/math/geometry/vector.js';
import { Stone } from '../objects.js';



export class Map extends Component {
    constructor(name, world) {
        super(name);

        this.world = world;

        this.area = new Area(0, 0, 800, 800);

        this.backgroundColor = 'saddlebrown';

        this.layers = [
            { id: 'ground', objects: [] },
            { id: 'sky', objects: [] },
        ];

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

            obj.area.x = Math.random() * this.world.game.engine.canvas.width;
            obj.area.y = Math.random() * this.world.game.engine.canvas.height;

            const scale = Math.random() * 0.5 + 0.5;

            obj.findComponents('SpriteRenderer')[0].sprite.scale = Vector2.full(scale);

            this.layers[0].objects.push(obj);
        }
    }

    generateEnvironments() {

    }

    removeGameObject(object) {
        this.layers.forEach(layer => {
            let index = layer.objects.indexOf(object);

            if (index >= 0) {
                layer.objects.splice(index, 1);
            }
        });
    }

    onUpdate(timeDelta) {
        if (Math.random() > 0.99) {
            this.generateObjects(1);
        }

        this.layers[0].objects = this.layers[0].objects.sort((a, b) => a.y - b.y);
    }

    onDraw(context) {
        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(...this.area.toList());

        this.layers.forEach(layer => {
            layer.objects.forEach(object => {
                object.draw(context);
            });
        });

        context.restore();
    }

    findGameObjectPointingByMouse(mousePosition, exceptionObjects) {
        let result = null;

        const camera = this.world.game.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        this.layers.reverse().forEach(layer => {
            layer.objects.reverse().forEach(object => {
                if (result && exceptionObjects.includes(object)) {
                    return;
                }
    
                const spriteRenderer = object.findComponents('SpriteRenderer')[0];
                const area = spriteRenderer.getSpriteArea();
                const areaPosition = area.getPosition();
                const areaSize = area.getSize();
                const areaPositionInWorld = object.localToGlobal(areaPosition);
                const areaInWorld = Area.combine(areaPositionInWorld, areaSize);
                
                if (areaInWorld.containsVector(mouseInWorld)) {
                    result = object;
                }
            });
        });

        return result;
    }
}