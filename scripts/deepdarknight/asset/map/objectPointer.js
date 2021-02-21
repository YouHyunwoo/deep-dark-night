import { BoxCollider } from '../../../engine/game/collider.js';
import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';



export class ObjectPointer extends Component {
    findGameObjectPointingByMouse(mousePosition, exceptionObjects) {
        const camera = this.scene.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        for (const layer of this.gameObject.reverseGameObjects) {
            for (const gameObject of layer.reverseGameObjects) {
                if (exceptionObjects.includes(gameObject)) {
                    continue;
                }
    
                let area = null;

                const boxCollider = gameObject.findComponent(BoxCollider);

                if (boxCollider) {
                    area = boxCollider.area;
                }
                else {
                    const spriteRenderer = gameObject.findComponent(SpriteRenderer);
                    area = spriteRenderer.getSpriteArea();
                }
                
                const areaPosition = area.getPosition();
                const areaSize = area.getSize();
                const areaPositionInWorld = gameObject.localToGlobal(areaPosition);
                const areaInWorld = Area.combine(areaPositionInWorld, areaSize);
                
                if (areaInWorld.containsVector(mouseInWorld)) {
                    return gameObject;
                }
            }
        }

        return null;
    }
}