import { Component } from '../../../engine/game/component.js';



export class Inventory extends Component {
    constructor(name) {
        super(name);

        this.items = {};
    }

    addItems(...items) {
        items.forEach(item => {
            if (!(item.name in this.items)) {
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