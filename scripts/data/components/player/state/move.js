import { State } from '../../state.js';
import { animations } from '../../../animations.js';



export class MoveState extends State {
    onInitialize() {
        super.onInitialize();

        const goState = this.owner;
        const goContext = goState.owner;
        const goPlayer = goContext.owner;

        this.direction = goPlayer.findComponent('Direction');
        this.animator = goPlayer.findComponent('Animator');
        this.movement = goPlayer.findComponent('Movement');
    }

    onUpdate(timeDelta) {
        const direction = this.direction.direction;
        
        this.animator.animation = animations.character.move[direction];

        if (this.movement.isArrived) {
            this.transit('idle');
        }
    }
}