import { GameObject } from '../../../engine/game/object.js';
import { Sprite } from '../../../engine/graphic/sprite.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';

import { stone as spriteSheetStone, tree as spriteSheetTree } from './sprites.js';
import { Inventory } from '../character/inventory.js';



export class Stone extends GameObject {
    constructor(name) {
        super(name ?? '돌');

        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        this.addComponents(spriteRenderer);

        spriteRenderer.sprite = new Sprite(spriteSheetStone);
        spriteRenderer.sprite.anchor = new Vector2(0.5, 0.9);


        const inventory = new Inventory('Inventory');

        this.addComponents(inventory);

        {
            const name = '돌';
            const count = ~~(Math.random() * 10) + 1;
    
            const inventoryItem = { name, count };

            inventory.addItems(inventoryItem);
        }
    }
}

export class Tree extends GameObject {
    constructor(name) {
        super(name ?? '나무');

        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        this.addComponents(spriteRenderer);

        spriteRenderer.sprite = new Sprite(spriteSheetTree);
        spriteRenderer.sprite.cropInOriginalImage = new Area(0, 0, 1 / 4, 1);
        spriteRenderer.sprite.anchor = new Vector2(0.5, 0.9);

        
        const inventory = new Inventory('Inventory');

        this.addComponents(inventory);

        {
            const name = '나무';
            const count = ~~(Math.random() * 5) + 5;
    
            const inventoryItem = { name, count };

            inventory.addItems(inventoryItem);
        }
    }
}