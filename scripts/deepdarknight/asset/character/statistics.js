import { Component } from '../../../engine/game/component.js';



export class Statistics extends Component {
	constructor(name) {
		super(name);

		this.hp = 0;
		this.maxhp = 0;

		this.strength = 0;

		this.movementSpeed = 0;

		this.gatheringRange = 0;
		this.gatheringSpeed = 0;
	}

	apply(statistics, inverse=false) {
		for (const key in statistics) {
			if (key in this) {
				this[key] += statistics[key] * (inverse ? -1 : 1);
			}
		}
	}
}