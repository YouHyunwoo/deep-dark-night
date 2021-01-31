import { GameObject } from '../engine/game/object.js';
import { Sprite } from "../engine/graphic/sprite.js";
import { Vector2 } from '../engine/math/geometry/vector.js';
import { SpriteRenderer } from './components/spriteRenderer.js';

import { stone as spriteSheetStone } from './sprites.js';



export class Stone extends GameObject {
    onInitialize() {
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        spriteRenderer.sprite = new Sprite(spriteSheetStone);
        spriteRenderer.sprite.anchor = new Vector2(0.5, 0.9);

        this.addComponents(spriteRenderer);
    }
}