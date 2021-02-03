import { Component } from "../../../engine/game/component.js";
import { Vector2 } from "../../../engine/math/geometry/vector.js";



export class Inventory extends Component {
    constructor(name) {
        super(name);

        this.items = {};

        this.isWindowShowing = false;

        this.positionWindow = new Vector2(400, 100);
        this.sizeWindow = new Vector2(250, 300);
    }

    onInitialize() {
        const object = this.owner;
        const layer = object.owner;
        const map = layer.owner;
        const world = map.owner;
        const scene = world.scene;
        const game = scene.game;
        const camera = game.camera;
        const engine = game.engine;

        this.object = object;
        this.game = game;
        this.camera = camera;
        this.engine = engine;
    }

    onUpdate(timeDelta) {
        for (const event of this.game.engine.events) {
            if (event.type === 'keyup') {
                if (event.key === 'i') {
                    this.isWindowShowing = !this.isWindowShowing;
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
        if (this.isWindowShowing) {
            const positionWorldInScreen = this.owner.globalToLocal(this.positionWindow);
            const offsetTitle = new Vector2(10, 24);
            const positionTitle = positionWorldInScreen.add(offsetTitle);
            
            context.save();

            context.fillStyle = 'white';
            context.fillRect(...positionWorldInScreen.toList(), ...this.sizeWindow.toList());

            context.font = '24px serif';
            context.fillStyle = 'Black';
            context.fillText('Inventory', ...positionTitle.toList());

            const itemNames = Object.keys(this.items);
            
            let i = 0;
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const sizeTitle = new Vector2(0, 30);
                    const margin = Vector2.full(10);
                    const orderSlot = new Vector2(col, row);
                    const sizeSlot = Vector2.full(50);
                    const positionSlot = positionWorldInScreen.add(sizeTitle).add(margin).add(orderSlot.multiplyEach(sizeSlot.add(margin)));
                    

                    context.fillStyle = 'grey';
                    context.fillRect(...positionSlot.toList(), ...sizeSlot.toList());
                    context.strokeStyle = 'black';
                    context.lineWidth = 1;
                    context.strokeRect(...positionSlot.toList(), ...sizeSlot.toList());


                    if (itemNames[i]) {
                        const spritePosition = positionSlot.add(Vector2.full(50).multiplyEach(new Vector2(0.5, 0.9)));

                        let sprite = null;
                        if (itemNames[i] === 'stone') {
                            sprite = new Sprite(spriteSheetStone);
                            sprite.anchor = new Vector2(0.5, 0.9);
                        }
                        else if (itemNames[i] === 'tree') {
                            sprite = new Sprite(spriteSheetTree);
                            sprite.cropInOriginalImage = new Area(0, 0, 1 / 4, 1);
                            sprite.anchor = new Vector2(0.5, 0.9);
                        }

                        sprite?.draw(context, spritePosition);

                        context.font = '12px serif';
                        context.fillStyle = 'black';
                        context.textAlign = 'left';
                        context.textBaseline = 'top';
                        context.fillText(itemNames[i], ...positionSlot.toList());

                        context.textAlign = 'right';
                        context.textBaseline = 'bottom';

                        const positionItemCount = positionSlot.add(sizeSlot).subtract(new Vector2(2, 0));
                        
                        context.fillText(this.items[itemNames[i]], ...positionItemCount.toList());
                    }

                    i++;
                }
            }

            context.restore();
        }
    }

    addItems(...items) {
        items.forEach(item => {
            if (!(item.name in this.items)) {
                this.items[item.name] = 0;
            }

            this.items[item.name] += item.count;
        });
    }

    removeItems(...items) {
        items.forEach(item => {
            if (!item.name in this.items) {
                this.items[item.name] = 0;
            }

            this.items[item.name] -= item.count;
        });
    }
}