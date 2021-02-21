import { State } from '../../../../engine/util/components/state.js';
import { Gathering } from '../../character/gathering.js';
import { Direction } from '../../character/direction.js';
import { Animator } from '../../../../engine/graphic/components/animator.js';
import { Movement } from '../../character/movement.js';
import { animations } from '../../data/animations.js';
import { IdleState } from './idle.js';
import { Statistics } from '../../character/statistics.js';



export class GatherState extends State {
    onInitialize() {
        this.gathering = this.context.gameObject.parent.findComponent(Gathering);
        this.direction = this.context.gameObject.parent.findComponent(Direction);
        this.animator = this.context.gameObject.parent.findComponent(Animator);
        this.movement = this.context.gameObject.parent.findComponent(Movement);
        this.stats = this.context.gameObject.parent.findComponent(Statistics);

        this.isGathering = false;
    }

    onEnter(targetObject) {
        this.targetObject = targetObject;

        this.isGathering = false;

        this.movement.range = this.stats.gatheringRange;
        this.movement.moveTo(targetObject.area.getPosition());
    }

    onUpdate(timeDelta) {
        if (this.isGathering) {
            const direction = this.direction.direction;
        
            this.animator.animation = animations.character.attack[direction];

            if (!this.gathering.isGathering) {
                this.transit(IdleState);
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