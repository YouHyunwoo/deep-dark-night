import { GameObject } from '../object.js';
import { Sprite } from "../sprite.js";

import { stone as spriteSheetStone } from './sprites.js';



export class Stone extends GameObject {
    constructor(name) {
        super(name);

        this.sprite = new Sprite(spriteSheetStone);
        this.sprite.anchor = [0.5, 0.9];
    }
}