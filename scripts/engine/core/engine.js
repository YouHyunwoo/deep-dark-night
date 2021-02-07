import { Vector2 } from '../math/geometry/vector.js';



export class Engine {
    constructor() {
        this.canvas = null;
        this.context = null;

        this.events = [];

        this.mouse = new Vector2(0, 0);

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
                position: new Vector2(e.offsetX, e.offsetY),
                bubble: true
            });
        });

        canvas.addEventListener('pointermove', (e) => {
            this.events.push({
                type: 'mousemove',
                position: new Vector2(e.offsetX, e.offsetY),
                bubble: true
            });

            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });

        canvas.addEventListener('pointerup', (e) => {
            this.events.push({
                type: 'mouseup',
                position: new Vector2(e.offsetX, e.offsetY),
                bubble: true
            })
        });

        window.addEventListener('keydown', (e) => {
            this.events.push({
                type: 'keydown',
                key: e.key,
                bubble: true
            })
        });

        window.addEventListener('keyup', (e) => {
            this.events.push({
                type: 'keyup',
                key: e.key,
                bubble: true
            })
        });

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
    }

    start() {
        this.#initializeGame();

        this.#startGameLoop();
    }

    #initializeGame() {
        this.game.init();
    }

    #startGameLoop() {
        const timeNow = Date.now();

        window.requestAFrame(() => this.gameLoop(timeNow));
    }

    gameLoop(timeLast) {
		const timeNow = Date.now();
		const timeDelta = (timeNow - timeLast) / 1000;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();

        this.game.event(this.events);
        this.game.update(timeDelta);
        this.game.draw(this.context);

        this.context.restore();

        this.events = [];

		window.requestAFrame(() => this.gameLoop(timeNow));
	}
}