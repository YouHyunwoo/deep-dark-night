import { GameObject } from '../../../engine/game/object.js';
import { PlayerInput } from './playerInput.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Animator } from '../../../engine/graphic/components/animator.js';
import { Direction } from '../character/direction.js';
import { Movement } from '../character/movement.js';
import { Gathering } from '../character/gathering.js';
import { Inventory } from '../character/inventory.js';
import { StateContext } from '../../../engine/util/components/state.js';
import { IdleState } from './state/idle.js';
import { MoveState } from './state/move.js';
import { GatherState } from './state/gather.js';



export class Player extends GameObject {
    constructor(name) {
        super(name);

        const player = new PlayerInput('PlayerInput');
        const spriteRenderer = new SpriteRenderer('SpriteRenderer');
        const animator = new Animator('Animator');
        const direction = new Direction('Direction');
        const movement = new Movement('Movement');
        const gathering = new Gathering('Gathering');
        const inventory = new Inventory('Inventory');

        this.addComponents(
            player,
            spriteRenderer,
            animator,
            direction,
            movement,
            gathering,
            inventory
        );

        const state = new GameObject('state');

        this.addGameObjects(state);

        {
            const stateContext = new StateContext('StateContext');

            state.addComponents(stateContext);
        }
        {
            const idle = new GameObject('idle');

            state.addGameObjects(idle);

            {
                const stateIdle = new IdleState('State');

                idle.addComponents(stateIdle);
            }

            const move = new GameObject('move');

            state.addGameObjects(move);

            {
                const stateMove = new MoveState('State');

                move.addComponents(stateMove);
            }

            const gather = new GameObject('gather');

            state.addGameObjects(gather);

            {
                const stateGather = new GatherState('State');

                gather.addComponents(stateGather);
            }
        }
    }
}