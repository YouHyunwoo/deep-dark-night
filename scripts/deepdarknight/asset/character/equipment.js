import { Component } from '../../../engine/game/component.js';
import { Inventory } from './inventory.js';
import { Statistics } from './statistics.js';



export class Equipment extends Component {
	static get None() { return null; }
	static get Head() { return 'HEAD'; }
	static get LeftHand() { return 'LEFTHAND'; }
	static get RightHand() { return 'RIGHTHAND'; }
	static get Body() { return 'BODY'; }
	static get Foot() { return 'FOOT'; }

	constructor(name) {
		super(name);

		this.head = null;
		this.leftHand = null;
		this.rightHand = null;
		this.body = null;
		this.foot = null;

		this.listeners = [];
	}

	addEventListener(listener) {
		this.listeners.push(listener);
	}

	removeEventListener(listener) {
		const index = this.listeners.indexOf(listener);

		if (index >= 0) {
			this.listeners.splice(index, 1);
		}
	}

	notify(event, ...args) {
		this.listeners.forEach(listener => {
			if (listener[event]) {
				listener[event](...args);
			}
		});
	}

	equip(item) {
		if (this._state === 'initialized') {
			this.notify('onRequestEquipment', item, this);

			const parts = {
				'머리': 'head',
				'손': null,
				'몸': 'body',
				'발': 'foot',
			}

			if (item.part in parts) {
				if (item.part.endsWith('손')) {
					if (!this.leftHand) {
						this.leftHand = item;

						this.notify('onEquip', this.leftHand, 'LEFTHAND', this);
					}
					else if (!this.rightHand) {
						this.rightHand = item;

						this.notify('onEquip', this.rightHand, 'RIGHTHAND', this);
					}
					else {
						this.notify('onUnequip', this.leftHand, 'LEFTHAND', this);
						this.leftHand = this.rightHand;
						this.notify('onEquip', this.leftHand, 'LEFTHAND', this);

						this.notify('onUnequip', this.rightHand, 'RIGHTHAND', this);
						this.rightHand = item;
						this.notify('onEquip', this.rightHand, 'RIGHTHAND', this);
					}
				}
				else {
					const equippedItem = this[parts[item.part]];

					if (equippedItem) {
						this.notify('onUnequip', equippedItem, parts[item.part].toUpperCase(), this);
					}
					
					this[parts[item.part]] = item;

					this.notify('onEquip', item, parts[item.part].toUpperCase(), this);
				}
			}
		}
	}

	unequip(part) {
		if (this._state === 'initialized') {
			this.notify('onRequestUnequipment', part, this);

			console.assert(part in this);

			if (this[part]) {
				this.notify('onUnequip', this[part], part.toUpperCase(), this);

				this[part] = null;
			}
		}
	}
}