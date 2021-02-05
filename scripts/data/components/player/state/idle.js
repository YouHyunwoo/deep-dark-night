import { State } from '../../state.js';
import { animations } from '../../../animations.js';



export class IdleState extends State {
    onInitialize() {
        super.onInitialize();

        const goState = this.owner;
        const goContext = goState.owner;
        const goPlayer = goContext.owner;

        this.player = goPlayer.findComponents('Player')[0];
        this.animator = goPlayer.findComponents('Animator')[0];
    }

    onEnter() {
        const direction = this.player.direction;
        
        this.animator.animation = animations.character.idle[direction];
    }
}