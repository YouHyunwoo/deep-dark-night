import { Component } from "../../../engine/game/component.js";



export class TimeSystem extends Component {

    #time;
    #speed;

    constructor(name) {
        super(name);

        this.#time = 0;

        Object.defineProperty(this, 'time', {
            get() {
                return this.#time;
            }
        });

        this.#speed = 3600;

        Object.defineProperty(this, 'speed', {
            get() {
                return this.#speed;
            },
            set(value) {
                const clamped = max(0, min(value, 3600 * 24));

                this.#speed = clamped;
            }
        });
    }

    onInitialize() {
        const scene = this.owner.scene;

        this.engine = scene.game.engine;
    }

    onUpdate(timeDelta) {
        this.#time += this.#speed * timeDelta;
    }

    onDraw(context) {
        if (this.isNight()) {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        }
    }

    getSeconds() {
        return Math.floor(this.#time % 60);
    }

    getMinutes() {
        return Math.floor(this.#time / 60 % 60);
    }

    getHours() {
        return Math.floor(this.#time / 3600 % 24);
    }

    getDate() {
        return Math.floor(this.#time / 24 / 3600);
    }

    isDay() {
        const hours = this.getHours();

        return 6 <= hours && hours <= 18;
    }

    isNight() {
        return !this.isDay();
    }
}