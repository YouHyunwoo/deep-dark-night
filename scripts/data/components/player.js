import { Component } from '../../engine/game/component.js';
import { Area } from '../../engine/math/geometry/area.js';



export class Player extends Component {
    constructor(name) {
        super(name);

        this.mouseover = null;
        this.selected = null;

        this.direction = 'down';
    }

    onInitialize() {
        const goPlayer = this.owner;
        const layer = goPlayer.owner;
        const map = layer.owner;
        const world = map.owner;
        const scene = world.scene;
        const game = scene.game;

        this.game = game;
        this.componentMap = map.findComponent('Map');
        
        this.movement = goPlayer.findComponent('Movement');
        this.gathering = goPlayer.findComponent('Gathering');

        const goState = goPlayer.findGameObject('state');
        
        this.state = goState.findComponent('StateContext');
    }

    onUpdate(timeDelta) {
        for (const event of this.game.engine.events) {
            if (event.type === 'keyup') {
                // console.log(event.key);

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
                
                if (this.mouseover) {
                    this.clickGameObjectInMap();
                }
                else {
                    this.selected = null;
                    this.clickGroundInMap(mousePosition);
                }
            }
            else if (event.type === 'mousemove') {
                const mousePosition = event.position;

                this.mouseover = this.findGameObjectPointingByMouseInMap(mousePosition);
            }
        }

        if (this.selected?.isDisposed()) {
            this.selected = null;
        }

        if (this.mouseover?.isDisposed()) {
            this.mouseover = null;
        }
    }

    onDraw(context) {
        if (this.selected && this.selected !== this.mouseover) {
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

        if (this.mouseover) {
            const spriteRenderer = this.mouseover.findComponent('SpriteRenderer');
            const area = spriteRenderer.getSpriteArea();
            const areaPosition = area.getPosition();
            const areaSize = area.getSize();
            const areaPositionInWorld = this.mouseover.localToGlobal(areaPosition);
            const areaPositionInPlayer = this.owner.globalToLocal(areaPositionInWorld);
            const areaInPlayer = Area.combine(areaPositionInPlayer, areaSize);

            context.lineWidth = 2;
            context.strokeStyle = 'green';
            context.strokeRect(...areaInPlayer.toList());
        }
    }

    clickGameObjectInMap() {
        if (this.selected !== this.mouseover) {
            this.selected = this.mouseover;

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
        const gameObject = this.componentMap.findGameObjectPointingByMouse(mousePosition, [this.owner]);

        return gameObject;
    }
}