import { State } from '../../../../engine/util/components/state.js';
import { Direction } from '../../character/direction.js';
import { Animator } from '../../../../engine/graphic/components/animator.js';
import { Movement } from '../../character/movement.js';
import { animations } from '../../data/animations.js';
import { IdleState } from './idle.js';



export class MoveState extends State {
    onInitialize() {
        const goContext = this.context.owner;
        const goPlayer = goContext.owner;

        this.direction = goPlayer.findComponent(Direction);
        this.animator = goPlayer.findComponent(Animator);
        this.movement = goPlayer.findComponent(Movement);
    }

    onUpdate(timeDelta) {
        const direction = this.direction.direction;

        this.animator.animation = animations.character.move[direction];

        if (this.movement.isArrived) {
            this.transit(IdleState);
        }
    }
}