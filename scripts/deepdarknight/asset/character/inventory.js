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

            this.events.notify('change', item.name, item.count, this);
        });
    }

    removeItems(...items) {
        items.forEach(item => {
            if (item.name in this.items) {
                this.items[item.name] -= item.count;

                this.events.notify('change', item.name, -item.count, this);

                if (this.items[item.name] <= 0) {
                    delete this.items[item.name];
                }
            }
        });
    }

    hasItem(itemName, count) {
        count = Math.min(0, count ?? 0);

        return itemName in this.items && this.items[itemName] >= count;
    }
}