import { Component } from '../../../engine/game/component.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Direction } from './direction.js';
import { Statistics } from './statistics.js';



export class Movement extends Component {
    constructor() {
        super();

        this.stats = null;

        this.isArrived = true;

        this.destination = Vector2.zeros();

        this.range = 0;
    }

    onInitialize() {
        const gameObject = this.owner;

        this.object = gameObject;
        this.direction = gameObject.findComponent(Direction);
        this.stats = gameObject.findComponent(Statistics);
    }

    onUpdate(timeDelta) {
        if (!this.isArrived) {
            const range = this.range;
            const speed = this.stats.movementSpeed;

            const distance = speed * timeDelta;
    
            const source = this.object.area.getPosition();
            const destination = this.destination;
    
            const sourceToDestination = destination.subtract(source);

            const angle = Math.atan2(...sourceToDestination.reverse().toList());
            
            const absAngle = Math.abs(angle);

            if (absAngle < Math.PI / 4) {
                this.direction.direction = 'right';
            }
            else if (absAngle > Math.PI * 3 / 4) {
                this.direction.direction = 'left';
            }
            else if (angle > 0) {
                this.direction.direction = 'down';
            }
            else {
                this.direction.direction = 'up';
            }
    
            const length = sourceToDestination.getMagnitude();
    
            if (range >= length) {
                this.isArrived = true;
            }
            else {
                const reach = length - range;
                const normalized = sourceToDestination.normalize();
    
                let positionObject = null;

                if (distance >= reach) {
                    positionObject = destination.subtract(normalized.multiply(range));

                    this.isArrived = true;
                }
                else {
                    positionObject = source.add(normalized.multiply(distance));
                }

                this.object.area.moveTo(positionObject);
            }
        }
    }

    moveTo(position) {
        this.isArrived = false;
        this.destination = position;
    }
}