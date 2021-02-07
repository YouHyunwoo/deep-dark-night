import { Item } from '../deepdarknight/game/item.js';
import { spriteStone, spriteTree1 } from './sprites.js';



export const items = {
    '돌': new Item('돌', '돌', spriteStone, '재료', null),
    '나무': new Item('나무', '나무', spriteTree1, '재료', null),
    '돌도끼': new Item('돌도끼', '돌과 나무로 만든 도끼', spriteStone, '장비', [['돌', 20], ['나무', 10]]),
    '돌칼': new Item('돌칼', '돌과 나무로 만든 칼', spriteStone, '장비', [['돌', 10], ['나무', 5]]),
}