import { World, Map } from './world.js';
import { GameObject } from './object.js';
import { Sprite } from './sprite.js';
import { character as characterSpriteSheet } from './data/sprites.js';



window.requestAFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						((callback) => window.setTimeout(callback, 1000 / 60));

window.cancelAFrame = window.cancelAnimationFrame ||
						window.webkitCancelAnimationFrame ||
						window.mozCancelAnimationFrame ||
						window.oCancelAnimationFrame ||
						((id) => window.clearTimeout(id));


class Game {
    constructor(engine) {
        this.engine = engine;

        this.world = null;
        this.player = null;
    }

    init() {
        this.world = new World(this);
        this.world.init();

            const map = new Map(this.world);
        
                this.player = new Player(this);
                this.player.map = map;

            map.ground.push(this.player.object);

        this.world.maps.push(map);
    }

    update(timeDelta) {
        this.world.update(timeDelta);
        this.player.update(timeDelta);
    }

    draw(context) {
        this.world.draw(context);
        this.player.draw(context);
    }
}

class Engine {

    #handler;

    constructor() {
        this.#handler = null;

        this.canvas = null;
        this.context = null;

        this.events = [];

        this.game = null;
    }

    init() {
        const canvas = this.canvas = document.querySelector('canvas');
        const context = this.context = canvas.getContext('2d');

        function resize() {
            let size = Math.min(window.innerWidth, window.innerHeight) - 10;

            canvas.width = canvas.height = size;
            canvas.style.left = Math.floor((window.innerWidth - canvas.width) / 2) + "px";
            canvas.style.top = Math.floor((window.innerHeight - canvas.height) / 2) + "px";

            context.imageSmoothingEnabled = false;
        }

        window.addEventListener('resize', resize);

        resize();

        canvas.addEventListener('pointerdown', (e) => {
            this.events.push({
                type: 'mousedown',
                x: e.offsetX,
                y: e.offsetY
            });
        });

        canvas.addEventListener('pointermove', (e) => {
            this.events.push({
                type: 'mousemove',
                x: e.offsetX,
                y: e.offsetY
            });
        });

        canvas.addEventListener('pointerup', (e) => {
            this.events.push({
                type: 'mouseup',
                x: e.offsetX,
                y: e.offsetY
            })
        });

        window.addEventListener('keydown', (e) => {
            this.events.push({
                type: 'keydown',
                key: e.key
            })
        });

        window.addEventListener('keyup', (e) => {
            this.events.push({
                type: 'keyup',
                key: e.key
            })
        });
    }

    start() {
        this.game.init();
    
        const timeNow = Date.now();

        this.#handler = window.requestAFrame(() => this.gameLoop(timeNow));
    }

    gameLoop(timeLast) {
		const timeNow = Date.now();
		const timeDelta = (timeNow - timeLast) / 1000;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.game.update(timeDelta);
        this.game.draw(this.context);

        this.events = [];

		this.#handler = window.requestAFrame(() => this.gameLoop(timeNow));
	}
}


class Player {
    constructor(game) {
        this.game = game;

        this.map = null;

        this.states = [
            new IdleState(this, 'idle'),
            new MoveState(this, 'move'),
            new GatherState(this, 'gather')
        ];

        this.state = this.states[0];

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
        this.state.update(timeDelta);

        this.gatherings.forEach(gathering => {
            gathering.progress += timeDelta;
        });

        this.gatherings = this.gatherings.filter(gathering => gathering.progress < 1);
    }

    draw(context) {
        this.state.draw(context);

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

class State {
    constructor(owner, id) {
        this.owner = owner;
        this.id = id;
    }

    update(timeDelta) {}
    draw(context) {}
}

class IdleState extends State {
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
                    
                    player.state = player.states[2];
                }
                else {
                    player.destination[0] = event.x;
                    player.destination[1] = event.y;

                    player.state = player.states[1];
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

class MoveState extends State {
    constructor(owner, id) {
        super(owner, id);
    }

    update(timeDelta) {
        const player = this.owner;

        for (const event of player.game.engine.events) {
            if (event.type === 'mousedown') {
                if (player.mouseover) {
                    player.selected = player.mouseover;
                    
                    player.state = player.states[2];
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

            player.state = player.states[0];
        }
        else {
            const normalized = [dx / length, dy / length];

            player.object.x += normalized[0] * speed;
            player.object.y += normalized[1] * speed;
        }
    }
}

class GatherState extends State {
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

                    player.state = player.states[1];
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

                player.state = player.states[0];
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

function containsArea(area, mouse) {
    const [x, y, w, h] = area;
    const [mx, my] = mouse;

    return x <= mx && mx < x + w && y <= my && my < y + h;
}


const engine = new Engine();

engine.init();

engine.game = new Game(engine);

engine.start();

