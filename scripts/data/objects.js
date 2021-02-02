import { GameObject } from '../engine/game/object.js';
import { Sprite } from "../engine/graphic/sprite.js";
import { Area } from '../engine/math/geometry/area.js';
import { Vector2 } from '../engine/math/geometry/vector.js';
import { SpriteRenderer } from './components/spriteRenderer.js';

import { stone as spriteSheetStone, tree as spriteSheetTree } from './sprites.js';



export class Stone extends GameObject {
    onInitialize() {
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        spriteRenderer.sprite = new Sprite(spriteSheetStone);
        spriteRenderer.sprite.anchor = new Vector2(0.5, 0.9);

        this.addComponents(spriteRenderer);
    }
}

export class Tree extends GameObject {
    onInitialize() {
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        spriteRenderer.sprite = new Sprite(spriteSheetTree);
        spriteRenderer.sprite.cropInOriginalImage = new Area(0, 0, 1 / 4, 1);
        spriteRenderer.sprite.anchor = new Vector2(0.5, 0.9);

        this.addComponents(spriteRenderer);
    }
}