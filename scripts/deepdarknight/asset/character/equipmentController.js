import { Component } from '../../../engine/game/component.js';
import { Equipment } from './equipment.js';
import { Inventory } from './inventory.js';
import { Statistics } from './statistics.js';
import { items } from '../data/items.js';



export class EquipmentController extends Component {
	constructor() {
		super();

		this.inventory = null;
		this.statistics = null;
		this.equipment = null;
	}

	onInitialize() {
		this.inventory = this.gameObject.findComponent(Inventory);
		this.statistics = this.gameObject.findComponent(Statistics);
        this.equipment = this.gameObject.findComponent(Equipment);

		this.inventoryWindow = this.gameObject.scene.findGameObject('uiSystem').findGameObject('inventoryWindow');
		this.inventoryWindow.events.addListener('clickItemSlot', this.onClickInventoryItem.bind(this));

		console.assert(!!this.inventory, 'GameObject가 Inventory Component를 가지고 있지 않습니다.');
		console.assert(!!this.statistics, 'GameObject가 Statistics Component를 가지고 있지 않습니다.');
		console.assert(!!this.equipment, 'GameObject가 Equipment Component를 가지고 있지 않습니다.');
        
        this.equipment.addEventListener(this);
    }

	onEquip(item, part, equipment) {
		console.log('equip', item, part);
		this.inventory.removeItems({ name: item.name, count: 1 });
		this.statistics.apply(item.capability);
	}

	onUnequip(item, part, equipment) {
		this.inventory.addItems({ name: item.name, count: 1 });
		this.statistics.apply(item.capability, true);
	}

	onClickInventoryItem(event, inventory) {
		const slot = event.target;

		if (!slot.isDisabled && slot.pointable) {
            const item = items[slot.itemName];

            if (item.type === '장비') {
				
                this.equipment.equip(item);
            }
        }
	}
}