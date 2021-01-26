import { TimeSystem } from './system.js';
import { World, Map } from './world.js';
import { GameObject } from './object.js';

class Game {
    constructor() {
        this.canvas = null;
        this.context = null;

        this.timeSystem = null;

        this.world = null;
        this.player = null;

        this.events = [];
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
        
        this.gameInit();
    
        const timeDelta = 1 / 30;
    
        setInterval(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            this.update(timeDelta);
            this.draw(context);

            this.events = [];
        }, 30);
    }

    gameInit() {
        this.timeSystem = new TimeSystem();

        this.world = new World(this);
    
        const map = new Map(this.world);
    
        this.player = new Player(this);

        map.ground.push(this.player.object);

        this.world.maps.push(map);
    }

    update(timeDelta) {
        this.timeSystem.update(timeDelta);

        this.world.update(timeDelta);

        this.player.update(timeDelta);
    }

    draw(context) {
        this.world.draw(context);

        if (this.timeSystem.isNight()) {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.player.draw(context);
    }
}


class Player {
    constructor(game) {
        this.game = game;

        this.isThereDestination = false;
        this.destination = [0, 0];
        this.speed = 1000;

        this.object = new GameObject();

        this.object.width = 100;
        this.object.height = 100;
    }

    update(timeDelta) {
        for (const event of this.game.events) {
            if (event.type === 'mousedown') {
                this.destination[0] = event.x;
                this.destination[1] = event.y;

                this.isThereDestination = true;
            }
        }

        if (this.isThereDestination) {
            const speed = this.speed * timeDelta;
        
            const dx = this.destination[0] - this.object.x;
            const dy = this.destination[1] - this.object.y;
    
            const length = Math.sqrt(dx ** 2 + dy ** 2);
    
            if (speed > length) {
                this.object.x = this.destination[0];
                this.object.y = this.destination[1];

                this.isThereDestination = false;
            }
            else {
                const normalized = [dx / length, dy / length];
    
                this.object.x += normalized[0] * speed;
                this.object.y += normalized[1] * speed;
            }
        }
    }

    draw(context) {
        context.save();

        context.fillStyle = 'red';
        context.fillRect(10, 10, 200, 10);

        context.restore();
    }
}


const game = new Game();

game.init();