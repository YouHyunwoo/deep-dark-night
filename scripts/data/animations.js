import { Area } from '../engine/math/geometry/area.js';
import { Vector2 } from '../engine/math/geometry/vector.js';
import { Sprite, SpriteAnimation, SpriteAnimationFrame } from "../engine/graphic/sprite.js";
import { character } from './sprites.js';



export const aniCharacterIdleUp = generateAnimation(character, 8, 4, 'right', 4, [1], characterSpriteCallback);
export const aniCharacterIdleDown = generateAnimation(character, 8, 4, 'right', 5, [1], characterSpriteCallback);
export const aniCharacterIdleRight = generateAnimation(character, 8, 4, 'right', 6, [1], characterSpriteCallback);
export const aniCharacterIdleLeft = generateAnimation(character, 8, 4, 'right', 7, [1], characterSpriteCallback);

export const aniCharacterMoveUp = generateAnimation(character, 8, 4, 'right', 4, [0.2, 0.2, 0.2, 0.2], characterSpriteCallback);
export const aniCharacterMoveDown = generateAnimation(character, 8, 4, 'right', 5, [0.2, 0.2, 0.2, 0.2], characterSpriteCallback);
export const aniCharacterMoveRight = generateAnimation(character, 8, 4, 'right', 6, [0.2, 0.2, 0.2, 0.2], characterSpriteCallback);
export const aniCharacterMoveLeft = generateAnimation(character, 8, 4, 'right', 7, [0.2, 0.2, 0.2, 0.2], characterSpriteCallback);

export const aniCharacterAttackUp = generateAnimation(character, 8, 4, 'right', 0, [0.1, 0.4], characterSpriteCallback);
export const aniCharacterAttackDown = generateAnimation(character, 8, 4, 'right', 1, [0.1, 0.4], characterSpriteCallback);
export const aniCharacterAttackRight = generateAnimation(character, 8, 4, 'right', 2, [0.1, 0.4], characterSpriteCallback);
export const aniCharacterAttackLeft = generateAnimation(character, 8, 4, 'right', 3, [0.1, 0.4], characterSpriteCallback);

function characterSpriteCallback(sprite) {
    sprite.scale = Vector2.full(2);
    sprite.anchor = new Vector2(0.5, 0.9);
}



function generateAnimation(sheet, row, column, direction, choice, durations, callback) {
    const frames = [];

    let [start, end, step, progressX] = [0, 0, 0, 0];

    if (direction === 'up') {
        console.assert(row >= durations.length);

        [start, end, step, progressX] = [row-1, -1, -1, 0];
    }
    else if (direction === 'down') {
        console.assert(row >= durations.length);

        [start, end, step, progressX] = [0, row, 1, 0];
    }
    else if (direction === 'right') {
        console.assert(column >= durations.length);

        [start, end, step, progressX] = [0, column, 1, 1];
    }
    else if (direction === 'left') {
        console.assert(column >= durations.length);

        [start, end, step, progressX] = [column-1, -1, -1, 1];
    }

    for (let i = start, j = 0; i !== end && j < durations.length; i += step, j++) {
        const sprite = new Sprite(sheet);

        const partX = progressX * i + (1 - progressX) * choice;
        const partY = (1 - progressX) * i + progressX * choice;

        sprite.cropInOriginalImage = new Area(partX / column, partY / row, 1 / column, 1 / row);

        callback(sprite);

        const frame = new SpriteAnimationFrame(sprite, durations[j]);

        frames.push(frame);
    }

    const animation = new SpriteAnimation(...frames);

    return animation;
}