import { GameObject } from '../object.js';
import { Sprite } from "../sprite.js";
import { SpriteRenderer } from './components.js';

import { stone as spriteSheetStone } from './sprites.js';



export class Stone extends GameObject {
    onInitialize() {
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        spriteRenderer.sprite = new Sprite(spriteSheetStone);
        spriteRenderer.sprite.anchor = [0.5, 0.9];

        this.addComponents(spriteRenderer);
    }
}