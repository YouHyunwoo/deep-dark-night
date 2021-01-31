import { Component } from '../../engine/game/component.js';
import { Area } from '../../engine/math/geometry/area.js';
import { Vector2 } from '../../engine/math/geometry/vector.js';



export class Player extends Component {
    constructor(name, game) {
        super(name);

        this.game = game;

        this.map = null;

        this.mouseover = null;
        this.selected = null;
    }

    onInitialize() {
        this.state = this.owner.findComponents('State')[0];
        this.movement = this.owner.findComponents('Movement')[0];
        this.gathering = this.owner.findComponents('Gathering')[0];
    }

    onUpdate(timeDelta) {
        for (const event of this.game.engine.events) {
            if (event.type === 'keyup') {
                console.log(event.key);
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
            const spriteRenderer = this.selected.findComponents('SpriteRenderer')[0];
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
            const spriteRenderer = this.mouseover.findComponents('SpriteRenderer')[0];
            const area = spriteRenderer.getSpriteArea();
            const areaPosition = area.getPosition();
            const areaSize = area.getSize();
            const areaPositionInWorld = this.mouseover.localToGlobal(areaPosition);
            const areaPositionInPlayer = this.owner.globalToLocal(areaPositionInWorld);
            const areaInPlayer = Area.combine(areaPositionInPlayer, areaSize);

            context.lineWidth = 3;
            context.strokeStyle = 'green';
            context.strokeRect(...areaInPlayer.toList());
        }
    }

    findGameObjectPointingByMouseInMap(mousePosition) {
        const map = this.map.findComponents('Map')[0];

        const gameObject = map.findGameObjectPointingByMouse(mousePosition, [this.owner]);

        return gameObject;
    }

    clickGameObjectInMap() {
        if (this.selected !== this.mouseover) {
            this.selected = this.mouseover;

            this.gathering.cancelGathering();

            this.state.transit('gather', null, [this.selected]);
        }
    }

    clickGroundInMap(mousePosition) {
        this.gathering.cancelGathering();

        const camera = this.game.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        this.movement.moveTo(mouseInWorld);

        this.state.transit('move');
    }
}

export class Inventory extends Component {
    constructor(name) {
        super(name);

        this.items = {};
    }

    addItems(...items) {
        items.forEach(item => {
            if (!item.name in this.items) {
                this.items[item.name] = 0;
            }

            this.items[item.name] += item.count;
        });
    }

    removeItems(...items) {
        items.forEach(item => {
            if (!item.name in this.items) {
                this.items[item.name] = 0;
            }

            this.items[item.name] -= item.count;
        });
    }
}

export class Movement extends Component {
    constructor(name) {
        super(name);

        this.arrived = true;

        this.destination = Vector2.zeros();
        this.range = 0;
        this.speed = 1000;
    }

    onInitialize() {
        this.object = this.owner;
        this.state = this.owner.findComponents('State')[0];
    }

    onUpdate(timeDelta) {
        if (!this.arrived) {
            const range = this.range;

            const distance = this.speed * timeDelta;
    
            const source = this.object.area.getPosition();
            const destination = this.destination;
    
            const sourceToDestination = destination.subtract(source);
    
            const length = sourceToDestination.getMagnitude();
    
            if (range >= length) {
                this.arrived = true;
            }
            else {
                const reach = length - range;
                const normalized = sourceToDestination.normalize();
    
                let positionObject = null;

                if (distance >= reach) {
                    positionObject = destination.subtract(normalized.multiply(range));

                    this.arrived = true;
                }
                else {
                    positionObject = source.add(normalized.multiply(distance));
                }

                this.object.area.moveTo(positionObject);
            }
        }
    }

    moveTo(position) {
        this.arrived = false;
        this.destination = position;
    }
}

export class Gathering extends Component {
    constructor(name) {
        super(name);

        this.gatherings = [];
        
        this.targetObject = null;

        this.isGathering = false;

        this.progress = 0;
        this.range = 20;
        this.speed = 1;
    }

    onInitialize() {
        this.object = this.owner;
        this.inventory = this.owner.findComponents('Inventory')[0];
    }

    onUpdate(timeDelta) {
        this.gatherings.forEach(gathering => {
            gathering.progress += timeDelta;
        });

        this.gatherings = this.gatherings.filter(gathering => gathering.progress < 1);

        if (this.isGathering) {
            this.progress += this.speed * timeDelta;

            // console.log(`[ Log ] 플레이어의 수집 정도: ${this.progress}`);
            if (this.progress >= 1) {
                this.progress = 0;
                
                if (this.targetObject) {
                    const itemName = this.targetObject.name;
                    const itemCount = Math.floor(this.targetObject.findComponents('SpriteRenderer')[0].sprite.scale.x + 1 + Math.random() * 3);

                    this.inventory.addItems({
                        name: itemName,
                        count: itemCount,
                    });
    
                    this.gatherings.push({
                        name: itemName,
                        count: itemCount,
                        progress: 0
                    });
    
                    console.log(`[ Log ] 플레이어가 ${itemName}을(를) ${itemCount}개 수집했다.`);
    
                    this.targetObject.remove();
                    this.targetObject = null;
                }

                this.isGathering = false;
            }
        }
    }

    onDraw(context) {
        context.save();

        this.gatherings.forEach(gathering => {
            const text = `${gathering.name} +${gathering.count}`;

            context.font = '24px serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = `rgba(255, 255, 255, ${1 - gathering.progress})`;
            context.fillText(text, 0, -gathering.progress * 20);
        });

        context.restore();

        if (this.isGathering) {
            const spriteRenderer = this.owner.findComponents('SpriteRenderer')[0];
            const area = spriteRenderer.getSpriteArea();
            const areaBar = new Area(area.x, area.y + area.height, area.width, 10);
            const areaProgress = areaBar.copy();

            areaProgress.width *= this.progress;

            context.fillStyle = 'black';
            context.fillRect(...areaBar.toList());

            context.fillStyle = 'red';
            context.fillRect(...areaProgress.toList());
        }
        else {
            // targetobject가 있으면
            if (this.targetObject) {
                context.strokeStyle = 'red';

                context.beginPath();
    
                context.moveTo(...this.object.area.getPosition().toList());
                context.lineTo(...this.targetObject.area.getPosition().toList());
    
                context.stroke();
            }
        }
    }

    gather(targetObject) {
        this.targetObject = targetObject;

        this.isGathering = true;
    }

    cancelGathering() {
        this.targetObject = null;
        this.isGathering = false;
        this.progress = 0;
    }
}

export class StateContext extends Component {
    constructor(name) {
        super(name);

        this.states = {};

        this.state = null;
    }

    onInitialize() {
        console.assert(Object.keys(this.states).length !== 0);

        Object.values(this.states).forEach(state => state.onInitialize());

        if (!this.state) {
            this.state = Object.values(this.states)[0];
        }

        this.state?.onEnter();
    }

    onDispose() {
        this.state?.onExit();

        this.state = null;

        this.states.forEach(state => state.onDispose());
    }

    onUpdate(timeDelta) {
        this.state?.onUpdate(timeDelta);
    }

    onDraw(context) {
        this.state?.onDraw(context);
    }

    addState(state) {
        this.states[state.name] = state;

        state.owner = this;
        state.onAdded();
    }

    removeState(stateId) {
        const state = this.states[stateId];

        delete this.states[stateId];

        if (this.state.id === stateId) {
            this.state = null;
        }

        state.owner = null;
        state.onRemoved();
    }

    transit(stateId, exitArgs, enterArgs) {
        this.state?.onExit(...(exitArgs ?? []));

        this.state = this.states[stateId];

        this.state?.onEnter(...(enterArgs ?? []));
    }
}

export class State extends Component {
    constructor(id) {
        super(id);

        this.owner = null;
    }

    onEnter() {}
    onExit() {}
}

export class PlayerState extends StateContext {
    constructor(name) {
        super(name);

        const states = [
            new IdleState('idle'),
            new MoveState('move'),
            new GatherState('gather'),
        ];

        states.forEach(state => {
            this.addState(state);
        });
    }
}

class IdleState extends State {
}

class MoveState extends State {
}

class GatherState extends State {
    constructor(id) {
        super(id);

        this.isGathering = false;
    }

    onInitialize() {
        const stateContext = this.owner;
        const object = stateContext.owner;

        this.movement = object.findComponents('Movement')[0];
        this.gathering = object.findComponents('Gathering')[0];
    }

    onEnter(targetObject) {
        this.targetObject = targetObject;

        this.isGathering = false;

        this.movement.range = this.gathering.range;
        this.movement.moveTo(targetObject.area.getPosition());
    }

    onUpdate(timeDelta) {
        if (!this.isGathering) {
            if (this.movement.arrived) {
                this.gathering.gather(this.targetObject);

                this.isGathering = true;
            }
            else {
                this.movement.moveTo(this.targetObject.area.getPosition());
            }
        }
    }
}