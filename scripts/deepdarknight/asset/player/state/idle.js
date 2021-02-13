import { State } from '../../../../engine/util/components/state.js';
import { Direction } from '../../character/direction.js';
import { Animator } from '../../../../engine/graphic/components/animator.js';
import { animations } from '../../data/animations.js';



export class IdleState extends State {
    onInitialize() {
        const goContext = this.context.owner;
        const goPlayer = goContext.owner;

        this.direction = goPlayer.findComponent(Direction);
        this.animator = goPlayer.findComponent(Animator);
    }

    onEnter() {
        const direction = this.direction.direction;
        
        this.animator.animation = animations.character.idle[direction];
    }
}