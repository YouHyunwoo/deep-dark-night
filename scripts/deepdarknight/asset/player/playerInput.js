import { BoxCollider } from '../../../engine/game/collider.js';
import { Component } from '../../../engine/game/component.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { StateContext } from '../../../engine/util/components/state.js';
import { Gathering } from '../character/gathering.js';
import { Movement } from '../character/movement.js';
import { Statistics } from '../character/statistics.js';
import { ObjectPointer } from '../map/ObjectPointer.js';
import { GatherState } from './state/gather.js';
import { MoveState } from './state/move.js';



export class PlayerInput extends Component {
    constructor(name) {
        super(name);

        this.pointed = null;
        this.selected = null;
    }

    onInitialize() {
        const gameObjectPlayer = this.owner;
        const layer = gameObjectPlayer.owner;
        const map = layer.owner;
        const world = map.owner;
        const scene = world.scene;
        const game = scene.game;

        this.game = game;
        this.map = map.findComponent(ObjectPointer);
        
        const uiSystem = scene.findGameObject('uiSystem');

        this.inventoryWindow = uiSystem.findGameObject('inventoryWindow');
        this.mixWindow = uiSystem.findGameObject('mixWindow');
        this.equipmentWindow = uiSystem.findGameObject('equipmentWindow');

        this.movement = gameObjectPlayer.findComponent(Movement);
        this.gathering = gameObjectPlayer.findComponent(Gathering);
        this.stats = gameObjectPlayer.findComponent(Statistics);

        const gameObjectState = gameObjectPlayer.findGameObject('state');
        
        this.state = gameObjectState.findComponent(StateContext);
    }

    onUpdate(timeDelta) {
        for (const event of this.game.engine.events) {
            if (event.type === 'keyup') {
                // console.log(event.key);

                if (event.key === 'i') {
                    this.inventoryWindow.toggle();
                }
                if (event.key === 'm') {
                    this.mixWindow.toggle();
                }
                if (event.key === 'e') {
                    this.equipmentWindow.toggle();
                }

                if (event.key === 'a') {
                    this.owner.scene.camera.position.x -= 10;
                }
                if (event.key === 'd') {
                    this.owner.scene.camera.position.x += 10;
                }
                if (event.key === 'w') {
                    this.owner.scene.camera.position.y -= 10;
                }
                if (event.key === 's') {
                    this.owner.scene.camera.position.y += 10;
                }
            }
            else if (event.type === 'mousedown') {
                const mousePosition = event.position;
                
                if (this.pointed) {
                    this.clickGameObjectInMap();
                }
                else {
                    this.selected = null;
                    this.clickGroundInMap(mousePosition);
                }
            }
        }

        const mousePosition = this.game.engine.mouse;

        this.pointed = this.findGameObjectPointingByMouseInMap(mousePosition);

        if (this.selected?.isDisposed()) {
            this.selected = null;
        }

        if (this.pointed?.isDisposed()) {
            this.pointed = null;
        }
    }

    onDraw(context) {
        if (this.selected && this.selected !== this.pointed) {
            let area = null;

            const boxCollider = this.selected.findComponent(BoxCollider);

            if (boxCollider) {
                area = boxCollider.area;
            }
            else {
                const spriteRenderer = this.selected.findComponent(SpriteRenderer);
                area = spriteRenderer.getSpriteArea();
            }

            const areaPosition = area.getPosition();
            const areaSize = area.getSize();
            const areaPositionInWorld = this.selected.localToGlobal(areaPosition);
            const areaPositionInPlayer = this.owner.globalToLocal(areaPositionInWorld);
            const areaInPlayer = Area.combine(areaPositionInPlayer, areaSize);

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.strokeRect(...areaInPlayer.toList());
        }

        if (this.pointed) {
            let area = null;

            const boxCollider = this.pointed.findComponent(BoxCollider);

            if (boxCollider) {
                area = boxCollider.area;
            }
            else {
                const spriteRenderer = this.pointed.findComponent(SpriteRenderer);
                area = spriteRenderer.getSpriteArea();
            }
            // const boxCollider = this.pointed.findComponent(BoxCollider);
            // const area = boxCollider.area;
            // const spriteRenderer = this.pointed.findComponent('SpriteRenderer');
            // const area = spriteRenderer.getSpriteArea();
            const areaPosition = area.getPosition();
            const areaSize = area.getSize();
            const areaPositionInWorld = this.pointed.localToGlobal(areaPosition);
            const areaPositionInPlayer = this.owner.globalToLocal(areaPositionInWorld);
            const areaInPlayer = Area.combine(areaPositionInPlayer, areaSize);

            context.lineWidth = 2;
            context.strokeStyle = 'green';
            context.strokeRect(...areaInPlayer.toList());
        }
    }

    clickGameObjectInMap() {
        if (this.selected !== this.pointed) {
            this.selected = this.pointed;

            this.gathering.cancel();

            this.state.transit(GatherState, null, [this.selected]);
        }
    }

    clickGroundInMap(mousePosition) {
        this.gathering.cancel();

        const camera = this.owner.scene.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        this.movement.range = 0;
        this.movement.speed = this.stats.movementSpeed;
        this.movement.moveTo(mouseInWorld);

        this.state.transit(MoveState);
    }

    findGameObjectPointingByMouseInMap(mousePosition) {
        const gameObject = this.map.findGameObjectPointingByMouse(mousePosition, [this.owner]);

        return gameObject;
    }
}