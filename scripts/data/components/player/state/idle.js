import { State } from '../../state.js';
import { animations } from '../../../animations.js';



export class IdleState extends State {
    onInitialize() {
        super.onInitialize();

        const goState = this.owner;
        const goContext = goState.owner;
        const goPlayer = goContext.owner;

        this.direction = goPlayer.findComponent('Direction');
        this.animator = goPlayer.findComponent('Animator');
    }

    onEnter() {
        const direction = this.direction.direction;
        
        this.animator.animation = animations.character.idle[direction];
    }
}