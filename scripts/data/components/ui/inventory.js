import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Sprite } from '../../../engine/graphic/sprite.js';
import { stone as spriteSheetStone, tree as spriteSheetTree } from '../../sprites.js';



export class InventoryWindow extends Component {
    constructor(name) {
        super(name);

        this.inventory = null;

        this.areaWindow = new Area(400, 100, 250, 300);
        
        this.isShowing = false;
    }

    onInitialize() {
        const ui = this.owner;
        const scene = ui.scene;
        const player = scene.player;
        
        this.player = player;
        this.game = scene.game;

        this.inventory = this.player.findComponent('Inventory');
    }

    onUpdate(timeDelta) {
        for (const event of this.game.engine.events) {
            if (event.type === 'keyup') {
                if (event.key === 'i') {
                    this.isShowing = !this.isShowing;
                }
            }
            // else if (event.type === 'mousedown') {
            //     const mousePosition = event.position;
            // }
            // else if (event.type === 'mousemove') {
            //     const mousePosition = event.position;
            // }
        }
    }

    onDraw(context) {
        if (this.isShowing) {
            this.#drawInventoryWindow(context);

            if (this.#existsInventory()) {
                this.#drawInventoryItems(context);
            }
        }
    }

    #drawInventoryWindow(context) {
        this.#drawWindow(context);
        this.#drawFrames(context);
    }

    #drawWindow(context) {
        const positionWindow = this.areaWindow.getPosition();
        const sizeWindow = this.areaWindow.getSize();
        const offsetTitle = new Vector2(10, 24);
        const positionTitle = positionWindow.add(offsetTitle);
        
        context.save();

        context.fillStyle = 'white';
        context.fillRect(...positionWindow.toList(), ...sizeWindow.toList());

        context.font = '24px serif';
        context.fillStyle = 'Black';
        context.fillText('Inventory', ...positionTitle.toList());

        context.restore();
    }

    #drawFrames(context) {
        const positionWindow = this.areaWindow.getPosition();
        const sizeTitle = new Vector2(0, 30);
        const margin = Vector2.full(10);
        const sizeSlot = Vector2.full(50);

        context.save();

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const orderSlot = new Vector2(col, row);
                const positionSlot = positionWindow.add(sizeTitle).add(margin).add(orderSlot.multiplyEach(sizeSlot.add(margin)));

                context.fillStyle = 'grey';
                context.fillRect(...positionSlot.toList(), ...sizeSlot.toList());
                context.strokeStyle = 'black';
                context.lineWidth = 1;
                context.strokeRect(...positionSlot.toList(), ...sizeSlot.toList());
            }
        }

        context.restore();
    }

    #existsInventory() {
        return !!this.inventory;
    }

    #drawInventoryItems(context) {
        const positionWindow = this.areaWindow.getPosition();
        const sizeTitle = new Vector2(0, 30);
        const margin = Vector2.full(10);
        const sizeSlot = Vector2.full(50);

        const positionAnchor = new Vector2(0.5, 0.9);

        const itemNames = Object.keys(this.inventory.items);
            
        let i = 0;

        context.save();
        
        context.font = '12px serif';
        context.fillStyle = 'black';

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const orderSlot = new Vector2(col, row);
                const positionSlot = positionWindow.add(sizeTitle).add(margin).add(orderSlot.multiplyEach(sizeSlot.add(margin)));

                if (itemNames[i]) {
                    const positionSprite = positionSlot.add(sizeSlot.multiplyEach(positionAnchor));

                    let sprite = null;

                    if (itemNames[i] === 'stone') {
                        sprite = new Sprite(spriteSheetStone);
                        sprite.anchor = positionAnchor;
                    }
                    else if (itemNames[i] === 'tree') {
                        sprite = new Sprite(spriteSheetTree);
                        sprite.cropInOriginalImage = new Area(0, 0, 1 / 4, 1);
                        sprite.anchor = positionAnchor;
                    }

                    sprite?.draw(context, positionSprite);

                    context.textAlign = 'left';
                    context.textBaseline = 'top';
                    context.fillText(itemNames[i], ...positionSlot.toList());

                    context.textAlign = 'right';
                    context.textBaseline = 'bottom';

                    const positionItemCount = positionSlot.add(sizeSlot).subtract(new Vector2(2, 0));
                    
                    context.fillText(this.inventory.items[itemNames[i]], ...positionItemCount.toList());
                }

                i++;
            }
        }

        context.restore();
    }
}