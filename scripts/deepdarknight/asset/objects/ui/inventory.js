import { Window } from './window.js';
import { Area } from '../../../../engine/math/geometry/area.js';
import { UIItemSlot } from './itemSlot.js';
import { UILabel } from '../../../../engine/game/ui/label.js';
import { Vector2 } from '../../../../engine/math/geometry/vector.js';
import { items } from '../../../../data/items.js';



export class InventoryWindow extends Window {
    constructor() {
        super('InventoryWindow');

        this.slots = [];

        this.inventory = null;

        this.backgroundColor = 'white';
    }

    onInitialize() {
        super.onInitialize();

        const scene = this.scene;
        const player = scene.player;

        this.inventory = player.findComponent('Inventory');

        {
            const label = new UILabel('title');

            label.area = new Area(10, 10, null, 20);
            label.fitContentHorizontal = true;
            label.font = '20px 굴림체';
            label.text = '인벤토리';
            label.backgroundColor = null;
    
            this.addGameObjects(label);
        }

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

                    const itemName = itemNames[index];

                    if (itemName) {
                        const itemCount = this.inventory.items[itemName];

                        const itemSprite = items[itemName].sprite.copy();
                        itemSprite.anchor = new Vector2(0, 0);

                        itemSlot.setItemSprite(itemSprite);
                        itemSlot.setItemName(itemName);
                        itemSlot.setItemCount(itemCount);
                    }
                    
                    this.slots.push(itemSlot);

                    this.addGameObjects(itemSlot);
                }
            }
        }
    }

    onUpdate(timeDelta) {
        if (this.inventory) {
            const itemNames = Object.keys(this.inventory.items);
            
            for (let i = 0; i < this.slots.length; i++) {
                const itemName = itemNames[i];

                if (itemName) {
                    const slot = this.findGameObject(`${i}`);

                    const itemCount = this.inventory.items[itemName];
                    const itemSprite = items[itemName].sprite.copy();
                    itemSprite.anchor = new Vector2(0, 0);

                    slot.setItemSprite(itemSprite);
                    slot.setItemName(itemName);
                    slot.setItemCount(itemCount);
                }
            }
        }
    }

    toggle() {
        this.visible = !this.visible;
    }
}