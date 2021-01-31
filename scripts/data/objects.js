import { GameObject } from '../engine/game/object.js';
import { Sprite } from "../engine/graphic/sprite.js";
import { SpriteRenderer } from './components/spriteRenderer.js';

import { stone as spriteSheetStone } from './sprites.js';



export class Stone extends GameObject {
    onInitialize() {
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        spriteRenderer.sprite = new Sprite(spriteSheetStone);
        spriteRenderer.sprite.anchor = [0.5, 0.9];

        this.addComponents(spriteRenderer);
    }
}