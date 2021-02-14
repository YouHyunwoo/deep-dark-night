import { Component } from '../../../engine/game/component.js';
import { Equipment } from './equipment.js';
import { Inventory } from './inventory.js';
import { Statistics } from './statistics.js';



export class EquipmentController extends Component {
	constructor() {
		super();

		this.inventory = null;
		this.statistics = null;
		this.equipment = null;
	}

	onInitialize() {
		this.inventory = this.owner.findComponent(Inventory);
		this.statistics = this.owner.findComponent(Statistics);
        this.equipment = this.owner.findComponent(Equipment);

		console.assert(!!this.inventory, 'GameObject가 Inventory Component를 가지고 있지 않습니다.');
		console.assert(!!this.statistics, 'GameObject가 Statistics Component를 가지고 있지 않습니다.');
		console.assert(!!this.equipment, 'GameObject가 Equipment Component를 가지고 있지 않습니다.');
        
        this.equipment.addEventListener(this);
    }

	onEquip(item, part, equipment) {
		this.inventory.removeItems({ name: item.name, count: 1 });
		this.statistics.apply(item.capability);
	}

	onUnequip(item, part, equipment) {
		this.inventory.addItems({ name: item.name, count: 1 });
		this.statistics.apply(item.capability, true);
	}
}