import { Component } from '../../component.js';
import { containsArea } from '../../geometry/area.js';



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
                if (event.key === 'a') {
                    this.game.camera.x -= 10;
                }
                if (event.key === 'd') {
                    this.game.camera.x += 10;
                }
                if (event.key === 'w') {
                    this.game.camera.y -= 10;
                }
                if (event.key === 's') {
                    this.game.camera.y += 10;
                }
            }
            else if (event.type === 'mousedown') {
                if (this.mouseover) {
                    this.clickGameObjectInMap();
                }
                else {
                    this.selected = null;
                    this.clickGroundInMap([event.x, event.y]);
                }
            }
            else if (event.type === 'mousemove') {
                this.mouseover = this.findGameObjectPointingByMouseInMap([event.x, event.y]);
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
            const area = this.selected.findComponents('SpriteRenderer')[0].getSpriteArea();
            const areaInWorld = [
                ...this.selected.localToGlobal(area.slice(0, 2)),
                ...area.slice(2)
            ];

            const areaInPlayer = [
                ...this.owner.globalToLocal(areaInWorld.slice(0, 2)),
                ...area.slice(2)
            ];

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.strokeRect(...areaInPlayer);
        }

        if (this.mouseover) {
            const area = this.mouseover.findComponents('SpriteRenderer')[0].getSpriteArea();
            const areaInWorld = [
                ...this.mouseover.localToGlobal(area.slice(0, 2)),
                ...area.slice(2)
            ];
            
            const areaInPlayer = [
                ...this.owner.globalToLocal(areaInWorld.slice(0, 2)),
                ...area.slice(2)
            ];

            context.lineWidth = 3;
            context.strokeStyle = 'green';
            context.strokeRect(...areaInPlayer);
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

        this.destination = [0, 0];
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
    
            const source = [this.object.x, this.object.y];
            const destination = this.destination;
    
            const sourceToDestination = [
                destination[0] - source[0],
                destination[1] - source[1]
            ];
    
            const length = this.#getMagnitude(sourceToDestination);
    
            if (range >= length) {
                this.arrived = true;
            }
            else {
                const reach = length - range;
                const normalized = [sourceToDestination[0] / length, sourceToDestination[1] / length];
    
                if (distance >= reach) {
                    this.object.x = destination[0] - normalized[0] * range;
                    this.object.y = destination[1] - normalized[1] * range;

                    this.arrived = true;
                }
                else {
                    this.object.x += normalized[0] * distance;
                    this.object.y += normalized[1] * distance;
                }
            }
        }
    }

    #getMagnitude(vector) {
        return Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
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
                    const itemCount = Math.floor(this.targetObject.findComponents('SpriteRenderer')[0].sprite.scale[0] + 1 + Math.random() * 3);

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
            const area = this.owner.findComponents('SpriteRenderer')[0].getSpriteArea();

            context.fillStyle = 'black';
            context.fillRect(area[0], area[1] + area[3], area[2], 10);

            context.fillStyle = 'red';
            context.fillRect(area[0], area[1] + area[3], area[2] * this.progress, 10);
        }
        else {
            // targetobject가 있으면
            if (this.targetObject) {
                context.strokeStyle = 'red';

                context.beginPath();
    
                context.moveTo(this.object.x, this.object.y);
                context.lineTo(this.targetObject.x, this.targetObject.y);
    
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
        this.movement.moveTo([targetObject.x, targetObject.y]);
    }

    onUpdate(timeDelta) {
        if (!this.isGathering) {
            if (this.movement.arrived) {
                this.gathering.gather(this.targetObject);

                this.isGathering = true;
            }
            else {
                this.movement.moveTo([this.targetObject.x, this.targetObject.y]);
            }
        }
    }
}