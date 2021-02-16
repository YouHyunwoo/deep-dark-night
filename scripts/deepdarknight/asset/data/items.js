import { spriteStone, spriteTree1, spriteWoodenShoes } from './sprites.js';



export const items = {
    '돌': {
        name: '돌',
        description: '돌',
        sprite: spriteStone,
        type: '재료',
        part: null,
        mix: null,
        capability: null,
    },
    '나무': {
        name: '나무',
        description: '나무',
        sprite: spriteTree1,
        type: '재료',
        part: null,
        mix: null,
        capability: null,
    },
    '돌도끼': {
        name: '돌도끼',
        description: '돌과 나무로 만든 도끼',
        sprite: spriteStone,
        type: '장비',
        part: '손',
        mix: [['돌', 20], ['나무', 10]],
        capability: { strength: +8 },
    },
    '돌칼': {
        name: '돌칼',
        description: '돌과 나무로 만든 칼',
        sprite: spriteStone,
        type: '장비',
        part: '손',
        mix: [['돌', 10], ['나무', 5]],
        capability: { strength: +10 },
    },
    '나무신발': {
        name: '나무신발',
        description: '나무로 만든 신발',
        sprite: spriteWoodenShoes,
        type: '장비',
        part: '발',
        mix: [['나무', 3]],
        capability: { movementSpeed: +100 },
    },
}