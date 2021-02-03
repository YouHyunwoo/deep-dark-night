import { Component } from '../../engine/game/component.js';
import { Area } from '../../engine/math/geometry/area.js';



export class Map extends Component {
    constructor(name) {
        super(name);

        this.backgroundColor = 'saddlebrown';
    }

    onInitialize() {
        const object = this.owner;
        const world = object.owner;
        const scene = world.scene;
        const game = scene.game;

        this.object = object;
        this.game = game;

        this.layers = object.objects;
    }

    onDraw(context) {
        context.save();

        context.fillStyle = this.backgroundColor;
        context.fillRect(...this.object.area.toList());

        context.restore();
    }

    findGameObjectPointingByMouse(mousePosition, exceptionObjects) {
        const camera = this.game.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        const reverseLayers = this.layers.slice().reverse();

        for (const layer of reverseLayers) {
            const reverseObjects = layer.objects.slice().reverse();

            for (const object of reverseObjects) {
                if (exceptionObjects.includes(object)) {
                    continue;
                }
    
                const spriteRenderer = object.findComponents('SpriteRenderer')[0];
                const area = spriteRenderer.getSpriteArea();
                const areaPosition = area.getPosition();
                const areaSize = area.getSize();
                const areaPositionInWorld = object.localToGlobal(areaPosition);
                const areaInWorld = Area.combine(areaPositionInWorld, areaSize);
                
                if (areaInWorld.containsVector(mouseInWorld)) {
                    return object;
                }
            }
        }

        return null;
    }
}