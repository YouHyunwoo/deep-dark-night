import { Sprite, SpriteSheet } from '../engine/graphic/sprite.js';
import { Area } from '../engine/math/geometry/area.js';
import { Vector2 } from '../engine/math/geometry/vector.js';



export const character = new SpriteSheet('images/character.png');


export const stone = new SpriteSheet('images/stone.png');

export const spriteStone = new Sprite(stone);
spriteStone.anchor = new Vector2(0.5, 0.9);


export const tree = new SpriteSheet('images/tree.png');

export const spriteTree1 = new Sprite(tree);
spriteTree1.cropInOriginalImage = new Area(0 / 4, 0, 1 / 4, 1);
spriteTree1.anchor = new Vector2(0.5, 0.9);

export const spriteTree2 = new Sprite(tree);
spriteTree2.cropInOriginalImage = new Area(1 / 4, 0, 1 / 4, 1);
spriteTree2.anchor = new Vector2(0.5, 0.9);

export const spriteTree3 = new Sprite(tree);
spriteTree3.cropInOriginalImage = new Area(2 / 4, 0, 1 / 4, 1);
spriteTree3.anchor = new Vector2(0.5, 0.9);

export const spriteTree4 = new Sprite(tree);
spriteTree4.cropInOriginalImage = new Area(3 / 4, 0, 1 / 4, 1);
spriteTree4.anchor = new Vector2(0.5, 0.9);