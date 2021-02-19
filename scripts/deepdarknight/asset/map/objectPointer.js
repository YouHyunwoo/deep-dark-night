import { BoxCollider } from '../../../engine/game/collider.js';
import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';



export class ObjectPointer extends Component {
    onInitialize() {
        const object = this.owner;
        const world = object.owner;
        const scene = world.scene;
        const game = scene.game;

        this.game = game;

        this.layers = object.objects;
    }

    findGameObjectPointingByMouse(mousePosition, exceptionObjects) {
        const camera = this.owner.scene.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        const reverseLayers = this.layers.slice().reverse();

        for (const layer of reverseLayers) {
            const reverseObjects = layer.objects.slice().reverse();

            for (const object of reverseObjects) {
                if (exceptionObjects.includes(object)) {
                    continue;
                }
    
                let area = null;

                const boxCollider = object.findComponent(BoxCollider);
                if (boxCollider) {
                    area = boxCollider.area;
                }
                else {
                    const spriteRenderer = object.findComponent(SpriteRenderer);
                    area = spriteRenderer.getSpriteArea();
                }
                
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