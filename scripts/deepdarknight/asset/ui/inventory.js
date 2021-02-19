import { UIContainer } from '../../../engine/game/ui/container.js';
import { UIItemSlot } from './itemSlot.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { items } from '../data/items.js';
import { Inventory } from '../character/inventory.js';
import { Equipment } from '../character/equipment.js';



export class InventoryWindow extends UIContainer {
    constructor(name) {
        super(name);

        this.slots = [];

        this.inventory = null;
        this.equipment = null;
    }

    onInitialize() {
        const scene = this.scene;
        const player = scene.player;

        this.inventory = player.findComponent(Inventory);
        this.inventory.events.addListener('change', this.onChangeInventory.bind(this));

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

                    itemSlot.events.addListener('click', this.onClickSlot.bind(this));
                    
                    this.slots.push(itemSlot);

                    this.addGameObjects(itemSlot);
                }
            }
        }
    }

    toggle() {
        this.visible = !this.visible;
    }

    onChangeInventory(itemName, itemCount, inventory) {
        const itemNames = Object.keys(inventory.items);
        
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
            }
            else if (slot.itemName) {
                slot.setItemSprite(null);
                slot.setItemName(null);
                slot.setItemCount(null);

                slot.pointable = false;
            }
        }
    }

    onClickSlot(event, slot) {
        this.events.notify('clickItem', event, slot, this);
    }
}