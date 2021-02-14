import { State } from '../../../../engine/util/components/state.js';
import { Gathering } from '../../character/gathering.js';
import { Direction } from '../../character/direction.js';
import { Animator } from '../../../../engine/graphic/components/animator.js';
import { Movement } from '../../character/movement.js';
import { animations } from '../../data/animations.js';
import { IdleState } from './idle.js';
import { Statistics } from '../../character/statistics.js';



export class GatherState extends State {
    constructor(id) {
        super(id);

        this.isGathering = false;
    }

    onInitialize() {
        const goContext = this.context.owner;
        const goPlayer = goContext.owner;

        this.gathering = goPlayer.findComponent(Gathering);
        this.direction = goPlayer.findComponent(Direction);
        this.animator = goPlayer.findComponent(Animator);
        this.movement = goPlayer.findComponent(Movement);
        this.stats = goPlayer.findComponent(Statistics);
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