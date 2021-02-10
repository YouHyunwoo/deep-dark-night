import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';



export class ObjectPointer extends Component {
    constructor(name) {
        super(name);
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
    
                const spriteRenderer = object.findComponent('SpriteRenderer');
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