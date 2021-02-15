import { Item } from '../../game/item.js';
import { spriteStone, spriteTree1, spriteWoodenShoes } from './sprites.js';



export const items = {
    '돌': new Item('돌', '돌', spriteStone, '재료', null),
    '나무': new Item('나무', '나무', spriteTree1, '재료', null),
    '돌도끼': new Item('돌도끼', '돌과 나무로 만든 도끼', spriteStone, '장비', [['돌', 20], ['나무', 10]], { strength: +8 }),
    '돌칼': //new Item('돌칼', '돌과 나무로 만든 칼', spriteStone, '장비', [['돌', 10], ['나무', 5]], { strength: +10 }),
    {
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