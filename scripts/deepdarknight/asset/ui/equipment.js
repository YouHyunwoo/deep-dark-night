import { UIContainer } from '../../../engine/game/ui/container.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Equipment } from '../character/equipment.js';
import { UIItemSlot } from './itemSlot.js';
import { items } from '../data/items.js';



export class EquipmentWindow extends UIContainer {
	constructor() {
		super();

		this.equipment = null;
	}

	onInitialize() {
		const scene = this.scene;
        const player = scene.player;

        this.equipment = player.findComponent(Equipment);

		this.equipment.addEventListener(this);

		{
			this.slotHead = new UIItemSlot('HEAD');

			this.addGameObjects(this.slotHead);

			this.slotHead.area = new Area(100, 50, 50, 50);
			this.slotHead.pointable = false;
		}

		{
			this.slotFoot = new UIItemSlot('FOOT');

			this.addGameObjects(this.slotFoot);

			this.slotFoot.area = new Area(100, 200, 50, 50);
			this.slotFoot.pointable = false;
		}
	}

	toggle() {
		this.visible = !this.visible;
	}

	onEquip(item, part, equipment) {
		const slot = this.findGameObject(part);

		if (slot) {
			const itemSprite = items[item.name].sprite.copy();
			itemSprite.anchor = new Vector2(0, 0);
	
			const itemName = item.name;
	
			slot.itemSprite = itemSprite;
			slot.itemName = itemName;
	
			slot.pointable = true;
	
			slot.onClick = () => {
				equipment.unequip('foot');
			}
		}
	}

	onUnequip(item, part, equipment) {
		const slot = this.findGameObject(part);
		
		if (slot) {
			slot.pointable = false;
			slot.reset();
		}
	}
}