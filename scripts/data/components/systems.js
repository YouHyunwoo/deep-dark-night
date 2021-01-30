import { Component } from "../../component.js";



export class TimeSystem extends Component {
    constructor(name) {
        super(name);
        this.time = 0;

        this.speed = 3600;
    }

    update(timeDelta) {
        this.time += this.speed * timeDelta;
    }

    getSeconds() {
        return Math.floor(this.time % 60);
    }

    getMinutes() {
        return Math.floor(this.time / 60 % 60);
    }

    getHours() {
        return Math.floor(this.time / 3600 % 24);
    }

    getDate() {
        return Math.floor(this.time / 24 / 3600);
    }

    isDay() {
        const hours = this.getHours();

        return 6 <= hours && hours <= 18;
    }

    isNight() {
        return !this.isDay();
    }
}