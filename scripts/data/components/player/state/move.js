import { State } from '../../state.js';
import { animations } from '../../../animations.js';



export class MoveState extends State {
    onInitialize() {
        super.onInitialize();

        const goState = this.owner;
        const goContext = goState.owner;
        const goPlayer = goContext.owner;

        this.player = goPlayer.findComponents('Player')[0];
        this.animator = goPlayer.findComponents('Animator')[0];
        this.movement = goPlayer.findComponents('Movement')[0];
    }

    onUpdate(timeDelta) {
        const direction = this.player.direction;
        
        this.animator.animation = animations.character.move[direction];

        if (this.movement.isArrived) {
            this.transit('idle');
        }
    }
}