import { State, StateContext } from './util/state.js';
import { GameObject } from './object.js';
import { Sprite } from './sprite.js';
import { character as characterSpriteSheet } from './data/sprites.js';
import { containsArea } from './geometry/area.js';



export class Player {
    constructor(game) {
        this.game = game;

        this.map = null;

        const states = [
            new IdleState(this, 'idle'),
            new MoveState(this, 'move'),
            new GatherState(this, 'gather')
        ];

        this.state = new StateContext(states);

        this.inventory = {};

        this.destination = [0, 0];
        this.speed = 1000;
        
        this.gatherings = [];
        this.gatheringProgress = 0;
        this.gatheringRange = 20;
        this.gatheringSpeed = 1;

        this.mouseover = null;
        this.selected = null;

        this.object = new GameObject('player');

        this.object.width = 100;
        this.object.height = 100;

        const sprite = this.object.sprite = new Sprite(characterSpriteSheet);

        sprite.cropInOriginalImage = [0, 5 / 8, 1 / 4, 1 / 8];
        sprite.scale = [2, 2];
        sprite.anchor = [0.5, 0.9];
    }

    update(timeDelta) {
        this.state.request('update', timeDelta);

        this.gatherings.forEach(gathering => {
            gathering.progress += timeDelta;
        });

        this.gatherings = this.gatherings.filter(gathering => gathering.progress < 1);
    }

    draw(context) {
        this.state.request('draw', context);

        context.save();
        
        if (this.selected && this.selected !== this.mouseover) {
            const area = this.selected.getSpriteArea();

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.strokeRect(...area);
        }

        if (this.mouseover) {
            const area = this.mouseover.getSpriteArea();

            context.lineWidth = 3;
            context.strokeStyle = 'green';
            context.strokeRect(...area);
        }

        this.gatherings.forEach(gathering => {
            const text = `${gathering.item} +${gathering.count}`;

            context.font = '24px serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = `rgba(255, 255, 255, ${1 - gathering.progress})`;
            context.fillText(text, this.object.x, this.object.y - gathering.progress * 20);
        })

        context.restore();
    }
}

class ObjectState extends State {
    request(messageId, ...messageContents) {
        if (messageId === 'update') {
            this.update(...messageContents);
        }
        else if (messageId === 'draw') {
            this.draw(...messageContents);
        }
    }

    update(timeDelta) {}
    draw(context) {}
}

class IdleState extends ObjectState {
    constructor(owner, id) {
        super(owner, id);
    }

    update(timeDelta) {
        const player = this.owner;

        for (const event of player.game.engine.events) {
            if (event.type === 'mousedown') {
                player.selected = null;

                if (player.mouseover) {
                    player.selected = player.mouseover;
                    
                    player.state.transit('gather');
                }
                else {
                    player.destination[0] = event.x;
                    player.destination[1] = event.y;

                    player.state.transit('move');
                }
            }
            else if (event.type === 'mousemove') {
                player.mouseover = null;

                const map = player.map;

                map.ground.forEach(obj => {
                    if (obj == player.object) {
                        return;
                    }

                    const area = obj.getSpriteArea();
                    const mouse = [event.x, event.y];

                    if (containsArea(area, mouse)) {
                        player.mouseover = obj;
                    }
                });
            }
        }
    }
}

class MoveState extends ObjectState {
    constructor(owner, id) {
        super(owner, id);
    }

    update(timeDelta) {
        const player = this.owner;

        for (const event of player.game.engine.events) {
            if (event.type === 'mousedown') {
                if (player.mouseover) {
                    player.selected = player.mouseover;
                    
                    player.state.transit('gather');
                }
                else {
                    player.destination[0] = event.x;
                    player.destination[1] = event.y;
                }
            }
            else if (event.type === 'mousemove') {
                player.mouseover = null;

                const map = player.map;

                map.ground.forEach(obj => {
                    if (obj == player.object) {
                        return;
                    }

                    const area = obj.getSpriteArea();
                    const mouse = [event.x, event.y];

                    if (containsArea(area, mouse)) {
                        player.mouseover = obj;
                    }
                });
            }
        }

        const speed = player.speed * timeDelta;
    
        const dx = player.destination[0] - player.object.x;
        const dy = player.destination[1] - player.object.y;

        const length = Math.sqrt(dx ** 2 + dy ** 2);

        if (speed > length) {
            player.object.x = player.destination[0];
            player.object.y = player.destination[1];

            player.state.transit('idle');
        }
        else {
            const normalized = [dx / length, dy / length];

            player.object.x += normalized[0] * speed;
            player.object.y += normalized[1] * speed;
        }
    }
}

class GatherState extends ObjectState {
    constructor(owner, id) {
        super(owner, id);

        this.gatheringProgress = 0;

        this.isGathering = false;
    }

    update(timeDelta) {
        const player = this.owner;

        for (const event of player.game.engine.events) {
            if (event.type === 'mousedown') {
                player.selected = null;
                this.isGathering = false;
                this.gatheringProgress = 0;

                if (player.mouseover) {
                    player.selected = player.mouseover;
                }
                else {
                    player.destination[0] = event.x;
                    player.destination[1] = event.y;

                    player.state.transit('move');
                    return;
                }
            }
            else if (event.type === 'mousemove') {
                player.mouseover = null;

                const map = player.map;

                map.ground.forEach(obj => {
                    if (obj == player.object) {
                        return;
                    }

                    const area = obj.getSpriteArea();
                    const mouse = [event.x, event.y];

                    if (containsArea(area, mouse)) {
                        player.mouseover = obj;
                    }
                });
            }
        }

        if (this.isGathering) {
            this.gatheringProgress += player.gatheringSpeed * timeDelta;

            console.log(`[ Log ] 플레이어의 수집 정도: ${this.gatheringProgress}`);
            if (this.gatheringProgress >= 1) {
                this.gatheringProgress = 0;

                this.isGathering = false;
                
                if (!player.selected.name in player.inventory) {
                    player.inventory[player.selected.name] = 0;
                }

                player.inventory[player.selected.name] += 1;

                player.gatherings.push({
                    item: '돌',
                    count: Math.floor(player.selected.sprite.scale[0] + 1 + Math.random() * 3),
                    progress: 0
                });

                console.log(`[ Log ] 플레이어가 ${player.selected.name}을(를) 수집했다.`);

                player.selected.remove();
                player.selected = null;

                player.state.transit('idle');
            }
        }
        else {
            const range = player.gatheringRange;

            const distance = player.speed * timeDelta;
    
            const dx = player.selected.x - player.object.x;
            const dy = player.selected.y - player.object.y;
    
            const length = Math.sqrt(dx ** 2 + dy ** 2);
    
            if (range >= length) {
                this.isGathering = true;
            }
            else {
                const reach = length - range;
                const normalized = [dx / length, dy / length];

                if (distance >= reach) {
                    player.object.x = player.selected.x - normalized[0] * range;
                    player.object.y = player.selected.y - normalized[1] * range;

                    this.isGathering = true;
                }
                else {
                    player.object.x += normalized[0] * distance;
                    player.object.y += normalized[1] * distance;
                }
            }
        }
    }

    draw(context) {
        const player = this.owner;

        if (this.isGathering) {
            const area = player.object.getSpriteArea();

            context.fillStyle = 'black';
            context.fillRect(area[0], area[1] + area[3], area[2], 10);

            context.fillStyle = 'red';
            context.fillRect(area[0], area[1] + area[3], area[2] * this.gatheringProgress, 10);
        }
        else {
            context.strokeStyle = 'red';

            context.beginPath();

            context.moveTo(player.object.x, player.object.y);
            context.lineTo(player.selected.x, player.selected.y);

            context.stroke();
        }
    }
}