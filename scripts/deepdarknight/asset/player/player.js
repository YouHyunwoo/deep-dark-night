import { Component } from '../../../engine/game/component.js';
import { GameObject } from '../../../engine/game/object.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Animator } from '../../../engine/graphic/components/animator.js';
import { Direction } from '../character/direction.js';
import { Movement } from '../character/movement.js';
import { Gathering } from '../character/gathering.js';
import { Inventory } from '../character/inventory.js';
import { StateContext } from '../../../engine/util/components/state.js';
import { IdleState } from './state/idle.js';
import { MoveState } from './state/move.js';
import { GatherState } from './state/gather.js';



export class Player extends GameObject {
    constructor(name) {
        super(name);

        const player = new PlayerComponent('Player');
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');
        const animator = new Animator('Animator');
        const direction = new Direction('Direction');
        const movement = new Movement('Movement');
        const gathering = new Gathering('Gathering');
        const inventory = new Inventory('Inventory');

        this.addComponents(
            player,
            spriteRenderer,
            animator,
            direction,
            movement,
            gathering,
            inventory
        );

        const state = new GameObject('state');

        this.addGameObjects(state);

        {
            const stateContext = new StateContext('StateContext');

            state.addComponents(stateContext);
        }
        {
            const idle = new GameObject('idle');

            state.addGameObjects(idle);

            {
                const stateIdle = new IdleState('State');

                idle.addComponents(stateIdle);
            }

            const move = new GameObject('move');

            state.addGameObjects(move);

            {
                const stateMove = new MoveState('State');

                move.addComponents(stateMove);
            }

            const gather = new GameObject('gather');

            state.addGameObjects(gather);

            {
                const stateGather = new GatherState('State');

                gather.addComponents(stateGather);
            }
        }
    }
}

export class PlayerComponent extends Component {
    constructor(name) {
        super(name);

        this.pointed = null;
        this.selected = null;
    }

    onInitialize() {
        const goPlayer = this.owner;
        const layer = goPlayer.owner;
        const map = layer.owner;
        const world = map.owner;
        const scene = world.scene;
        const game = scene.game;

        this.game = game;
        this.map = map.findComponent('ObjectPointer');
        
        this.inventoryWindow = scene.findGameObject('uiSystem').findGameObject('InventoryWindow');
        this.mixWindow = scene.findGameObject('uiSystem').findGameObject('MixWindow');

        this.movement = goPlayer.findComponent('Movement');
        this.gathering = goPlayer.findComponent('Gathering');

        const goState = goPlayer.findGameObject('state');
        
        this.state = goState.findComponent('StateContext');
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

                if (event.key === 'a') {
                    this.game.camera.position.x -= 10;
                }
                if (event.key === 'd') {
                    this.game.camera.position.x += 10;
                }
                if (event.key === 'w') {
                    this.game.camera.position.y -= 10;
                }
                if (event.key === 's') {
                    this.game.camera.position.y += 10;
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
            const spriteRenderer = this.selected.findComponent('SpriteRenderer');
            const area = spriteRenderer.getSpriteArea();
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
            const spriteRenderer = this.pointed.findComponent('SpriteRenderer');
            const area = spriteRenderer.getSpriteArea();
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

            this.state.transit('gather', null, [this.selected]);
        }
    }

    clickGroundInMap(mousePosition) {
        this.gathering.cancel();

        const camera = this.game.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        this.movement.moveTo(mouseInWorld);

        this.state.transit('move');
    }

    findGameObjectPointingByMouseInMap(mousePosition) {
        const gameObject = this.map.findGameObjectPointingByMouse(mousePosition, [this.owner]);

        return gameObject;
    }
}