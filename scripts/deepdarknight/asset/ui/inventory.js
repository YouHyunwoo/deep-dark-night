import { UIContainer } from '../../../engine/game/ui/container.js';
import { UIItemSlot } from './itemSlot.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { items } from '../data/items.js';
import { Inventory } from '../character/inventory.js';
import { Equipment } from '../character/equipment.js';



export class InventoryWindow extends UIContainer {
    constructor(name='InventoryWindow') {
        super(name);

        this.slots = [];

        this.inventory = null;
        this.equipment = null;
    }

    onInitialize() {
        const scene = this.scene;
        const player = scene.player;

        this.inventory = player.findComponent(Inventory);
        this.equipment = player.findComponent(Equipment);

        {
            const itemNames = Object.keys(this.inventory.items);

            const sizeSlot = Vector2.full(50);

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const index = row * 4 + col;

                    const orderSlot = new Vector2(col, row);

                    const position = orderSlot.multiplyEach(Vector2.full(10).add(sizeSlot));

                    const itemSlot = new UIItemSlot(`${index}`);

                    itemSlot.area = new Area(10 + position.x, 40 + position.y, ...sizeSlot.toList());
                    itemSlot.pointable = false;

                    const itemName = itemNames[index];

                    if (itemName) {
                        const itemCount = this.inventory.items[itemName];

                        const itemSprite = items[itemName].sprite.copy();
                        itemSprite.anchor = new Vector2(0, 0);

                        itemSlot.setItemSprite(itemSprite);
                        itemSlot.setItemName(itemName);
                        itemSlot.setItemCount(itemCount);

                        itemSlot.pointable = true;
                    }

                    itemSlot.onClick = () => {
                        if (!itemSlot.isDisabled && itemSlot.pointable) {
                            const item = items[itemName];

                            if (item.type === '장비') {
                                this.equipment.equip(item);
                                console.log(this.equipment);
                            }
                        }
                    };
                    
                    this.slots.push(itemSlot);

                    this.addGameObjects(itemSlot);
                }
            }
        }
    }

    onUpdate(timeDelta) {
        if (this.inventory) {
            // inventory onChange callback
            const itemNames = Object.keys(this.inventory.items);
            
            for (let i = 0; i < this.slots.length; i++) {
                const itemName = itemNames[i];
                const slot = this.findGameObject(`${i}`);

                if (itemName) {
                    const itemCount = this.inventory.items[itemName];
                    const itemSprite = items[itemName].sprite.copy();
                    itemSprite.anchor = new Vector2(0, 0);

                    slot.setItemSprite(itemSprite);
                    slot.setItemName(itemName);
                    slot.setItemCount(itemCount);

                    slot.pointable = true;

                    slot.onClick = () => {
                        if (!slot.isDisabled && slot.pointable) {
                            const item = items[itemName];

                            if (item.type === '장비') {
                                this.equipment.equip(item);
                            }
                        }
                    }
                }
                else if (slot.itemName) {
                    slot.setItemSprite(null);
                    slot.setItemName(null);
                    slot.setItemCount(null);

                    slot.pointable = false;
                }
            }
        }
    }

    toggle() {
        this.visible = !this.visible;
    }
}