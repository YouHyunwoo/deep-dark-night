import { UIContainer } from './container.js';
import { UIItemSlot } from './itemSlot.js';
import { UIObject } from '../../../engine/game/ui/object.js';
import { UILabel } from '../../../engine/game/ui/label.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { items } from '../data/items.js';
import { Inventory } from '../character/inventory.js';




export class MixWindow extends UIContainer {
    constructor(name='MixWindow') {
        super(name);

        this.inventory = null;
    }

    onInitialize() {
        const scene = this.scene;
        const player = scene.player;

        this.inventory = player.findComponent(Inventory);


        const sizeSlot = Vector2.full(50);

        // Container : Mix ...
        // Mix : Product + Material
        const areaContainer = new Area(10, 40, this.area.width - 20, this.area.height - 50);
        const areaMix = new Area(0, 0, this.area.width - 20, 70);
        const areaProduct = new Area(0, 0, 70, areaMix.height);
        const areaMaterial = new Area(0, 0, areaMix.width - areaProduct.width, areaMix.height);

        const positionContainer = areaContainer.getPosition();

        const sizeMix = areaMix.getSize();
        const sizeProduct = areaProduct.getSize();
        
        let positionCurrentMix = positionContainer.copy();

        for (const itemId in items) {
            const item = items[itemId];

            if (item.mix) {
                const uiMix = new UIContainer(`${item.name}`);

                uiMix.borderColor = 'green';
                uiMix.area = Area.combine(positionCurrentMix, sizeMix);

                this.addGameObjects(uiMix);

                {
                    const itemName = item.name;

                    const uiProduct = new UIObject('product');

                    uiMix.addGameObjects(uiProduct);

                    uiProduct.area = Area.combine(Vector2.zeros(), sizeProduct);

                    const slotProduct = new UIItemSlot('itemSlot');

                    {
                        uiProduct.addGameObjects(slotProduct);

                        const positionSlotProduct = sizeProduct.subtract(sizeSlot).divide(2);

                        slotProduct.area = Area.combine(positionSlotProduct, sizeSlot);

                        const itemSprite = items[itemName].sprite.copy();
                        itemSprite.anchor = new Vector2(0, 0);
                        
                        slotProduct.setItemSprite(itemSprite);
                        slotProduct.setItemName(itemName);
                        slotProduct.setItemCount(1);
                    }


                    const uiMaterial = new UIObject('material');

                    uiMix.addGameObjects(uiMaterial);

                    uiMaterial.area = Area.combine(new Vector2(uiProduct.area.width, 0), areaMaterial.getSize());

                    {
                        let positionCurrentMaterial = new Vector2(10, (areaMaterial.height - sizeSlot.y) / 2);

                        let isCollectComplete = true;
                        
                        let i = 0;
                        for (const material of item.mix) {
                            const [materialItemName, materialItemCount] = material;
                            
                            const inventoryCount = this.inventory.items[materialItemName] ?? 0;
        
                            const isDisabled = inventoryCount < materialItemCount;
        
                            {
                                const slotMaterial = new UIItemSlot(`${i}`);

                                uiMaterial.addGameObjects(slotMaterial);
            
                                slotMaterial.area = Area.combine(positionCurrentMaterial, sizeSlot);
            
                                const itemSprite = items[materialItemName].sprite.copy();
                                itemSprite.anchor = new Vector2(0, 0);
            
                                slotMaterial.setItemSprite(itemSprite);
                                slotMaterial.setItemName(materialItemName);
                                slotMaterial.setItemCount(materialItemCount);
            
                                slotMaterial.isDisabled = isDisabled;

                                i++;
                            }
        
                            positionCurrentMaterial = positionCurrentMaterial.add(new Vector2(sizeSlot.x + 10, 0));
        
                            isCollectComplete = isCollectComplete && !isDisabled;
                        }
        
                        slotProduct.isDisabled = !isCollectComplete;
                    }
                }

                positionCurrentMix = positionCurrentMix.add(new Vector2(0, sizeMix.y + 10));
            }
        }
    }

    onUpdate(timeDelta) {
        if (this.inventory) {

            for (const itemId in items) {
                const item = items[itemId];
    
                if (item.mix) {
                    const uiMix = this.findGameObject(`${item.name}`);

                    const uiProduct = uiMix.findGameObject('product');

                    const slotProduct = uiProduct.findGameObject('itemSlot');

                    let isCollectComplete = true;

                    const uiMaterial = uiMix.findGameObject('material');

                    let i = 0;
                    for (const material of item.mix) {
                        const [materialItemName, materialItemCount] = material;
                        
                        const inventoryCount = this.inventory.items[materialItemName] ?? 0;
    
                        const isDisabled = inventoryCount < materialItemCount;

                        const slotMaterial = uiMaterial.findGameObject(`${i}`);

                        slotMaterial.isDisabled = isDisabled;

                        isCollectComplete = isCollectComplete && !isDisabled;

                        i++;
                    }

                    slotProduct.isDisabled = !isCollectComplete;
                }
            }
        }
    }

    toggle() {
        this.visible = !this.visible;
    }
}