import { Sprite, SpriteSheet } from '../../../engine/graphic/sprite.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';



export const character = new SpriteSheet('scripts/deepdarknight/resources/images/character.png');


export const stone = new SpriteSheet('scripts/deepdarknight/resources/images/stone.png');

export const spriteStone = new Sprite(stone);
spriteStone.anchor = new Vector2(0.5, 0.9);


export const tree = new SpriteSheet('scripts/deepdarknight/resources/images/tree.png');

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


export const woodenShoes = new SpriteSheet('scripts/deepdarknight/resources/images/woodenShoes.png');

export const spriteWoodenShoes = new Sprite(woodenShoes);
spriteWoodenShoes.scale = new Vector2(0.03, 0.03);

export const woodenKnife = new SpriteSheet('scripts/deepdarknight/resources/images/woodenKnife.png');

export const spriteWoodenKnife = new Sprite(woodenKnife);
// spriteWoodenKnife.scale = new Vector2(0.03, 0.03);

export const woodenAxe = new SpriteSheet('scripts/deepdarknight/resources/images/woodenAxe.png');

export const spriteWoodenAxe = new Sprite(woodenAxe);
// spriteWoodenAxe.scale = new Vector2(0.03, 0.03);