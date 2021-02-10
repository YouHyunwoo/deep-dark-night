import { State } from '../../../../engine/util/components/state.js';
import { animations } from '../../data/animations.js';



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

        this.movement = goPlayer.findComponent('Movement');
        this.gathering = goPlayer.findComponent('Gathering');
        this.direction = goPlayer.findComponent('Direction');
        this.animator = goPlayer.findComponent('Animator');
    }

    onEnter(targetObject) {
        this.targetObject = targetObject;

        this.isGathering = false;

        this.movement.range = this.gathering.range;
        this.movement.moveTo(targetObject.area.getPosition());
    }

    onUpdate(timeDelta) {
        if (this.isGathering) {
            const direction = this.direction.direction;
        
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

                const direction = this.direction.direction;
        
                this.animator.animation = animations.character.move[direction];
            }
        }
    }
}