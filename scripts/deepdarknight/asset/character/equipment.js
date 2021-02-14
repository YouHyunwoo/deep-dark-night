import { Component } from '../../../engine/game/component.js';
import { Inventory } from './inventory.js';
import { Statistics } from './statistics.js';



export class Equipment extends Component {
	constructor(name) {
		super(name);

		this.stats = null;

		this.head = null;
		this.leftHand = null;
		this.rightHand = null;
		this.body = null;
		this.foot = null;
	}

	onInitialize() {
		this.stats = this.owner.findComponent(Statistics);
		this.inventory = this.owner.findComponent(Inventory);
	}

	equip(item) {
		if (this._state === 'initialized') {
			const parts = {
				'머리': 'head',
				'손': 'hand',
				'몸': 'body',
				'발': 'foot',
			}

			if (item.part in parts) {
				if (item.part.endsWith('손')) {
					if (!this.leftHand) {
						this.leftHand = item;
					}
					else if (!this.rightHand) {
						this.rightHand = item;
					}
					else {
						this.inventory.addItems({ name: this.leftHand.name, count: 1 });
						this.stats.apply(this.leftHand.capability, true);

						this.leftHand = this.rightHand;
						this.rightHand = item;
					}
				}
				else {
					if (this[parts[item.part]]) {
						this.stats.apply(this[parts[item.part]].capability, true);

						this.inventory.addItems({ name: this[parts[item.part]].name, count: 1 });
					}
					
					this[parts[item.part]] = item;
				}

				this.stats.apply(item.capability);

				this.inventory.removeItems({ name: item.name, count: 1 });
			}
		}
	}

	unequip(part) {
		if (this.state === 'initialized') {
			console.assert(part in this);

			if (this[part]) {
				this.inventory.addItems({ name: this[part], count: 1 });
				this.stats.apply(this[part].capability, true);

				this[part] = null;
			}
		}
	}
}