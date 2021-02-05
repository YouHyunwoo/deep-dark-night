import { Component } from '../../engine/game/component.js';
import { Vector2 } from '../../engine/math/geometry/vector.js';
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
        this.componentMap = map.findComponents('Map')[0];
        
        this.movement = goPlayer.findComponents('Movement')[0];
        this.gathering = goPlayer.findComponents('Gathering')[0];

        const goState = goPlayer.findGameObjects('state')[0];
        
        this.state = goState.findComponents('StateContext')[0];
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

            context.lineWidth = 2;
            context.strokeStyle = 'green';
            context.strokeRect(...areaInPlayer.toList());
        }
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

    findGameObjectPointingByMouseInMap(mousePosition) {
        const gameObject = this.componentMap.findGameObjectPointingByMouse(mousePosition, [this.owner]);

        return gameObject;
    }
}

export class Movement extends Component {
    constructor(name) {
        super(name);

        this.isArrived = true;

        this.destination = Vector2.zeros();
        this.range = 0;
        this.speed = 200;
    }

    onInitialize() {
        this.object = this.owner;
        this.player = this.owner.findComponents('Player')[0];
        this.state = this.owner.findComponents('State')[0];
    }

    onUpdate(timeDelta) {
        if (!this.arrived) {
            const range = this.range;

            const distance = this.speed * timeDelta;
    
            const source = this.object.area.getPosition();
            const destination = this.destination;
    
            const sourceToDestination = destination.subtract(source);

            const angle = Math.atan2(...sourceToDestination.reverse().toList());
            
            const absAngle = Math.abs(angle);

            if (absAngle < Math.PI / 4) {
                this.player.direction = 'right';
            }
            else if (absAngle > Math.PI * 3 / 4) {
                this.player.direction = 'left';
            }
            else if (angle > 0) {
                this.player.direction = 'down';
            }
            else {
                this.player.direction = 'up';
            }
    
            const length = sourceToDestination.getMagnitude();
    
            if (range >= length) {
                this.isArrived = true;
            }
            else {
                const reach = length - range;
                const normalized = sourceToDestination.normalize();
    
                let positionObject = null;

                if (distance >= reach) {
                    positionObject = destination.subtract(normalized.multiply(range));

                    this.isArrived = true;
                }
                else {
                    positionObject = source.add(normalized.multiply(distance));
                }

                this.object.area.moveTo(positionObject);
            }
        }
    }

    moveTo(position) {
        this.isArrived = false;
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