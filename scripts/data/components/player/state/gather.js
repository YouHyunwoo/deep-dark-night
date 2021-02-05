import { State } from '../../state.js';
import { animations } from '../../../animations.js';



export class GatherState extends State {
    constructor(id) {
        super(id);

        this.isGathering = false;
    }

    onInitialize() {
        super.onInitialize();

        const goState = this.owner;
        const goContext = goState.owner;
        const goPlayer = goContext.owner;

        this.movement = goPlayer.findComponents('Movement')[0];
        this.gathering = goPlayer.findComponents('Gathering')[0];
        this.player = goPlayer.findComponents('Player')[0];
        this.animator = goPlayer.findComponents('Animator')[0];
    }

    onEnter(targetObject) {
        this.targetObject = targetObject;

        this.isGathering = false;

        this.movement.range = this.gathering.range;
        this.movement.moveTo(targetObject.area.getPosition());
    }

    onUpdate(timeDelta) {
        if (this.isGathering) {
            const direction = this.player.direction;
        
            this.animator.animation = animations.character.attack[direction];

            if (!this.gathering.isGathering) {
                this.transit('idle');
            }
        }
        else {
            if (this.movement.isArrived) {
                this.gathering.gather(this.targetObject);

                this.isGathering = true;
            }
            else {
                this.movement.moveTo(this.targetObject.area.getPosition());

                const direction = this.player.direction;
        
                this.animator.animation = animations.character.move[direction];
            }
        }
    }
}