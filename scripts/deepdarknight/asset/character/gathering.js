import { Component } from '../../../engine/game/component.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Inventory } from './inventory.js';
import { Statistics } from './statistics.js';



export class Gathering extends Component {
    constructor() {
        super();

        this.gatheringQueue = [];
        this.gatherings = [];
        
        this.targetObject = null;

        this.isGathering = false;

        this.progress = 0;

        this.stats = null;
    }

    onInitialize() {
        const gameObject = this.gameObject;

        this.object = gameObject;
        this.inventory = gameObject.findComponent(Inventory);
        this.stats = gameObject.findComponent(Statistics);
    }

    onUpdate(timeDelta) {
        this.gatherings.forEach(gathering => {
            gathering.progress += timeDelta;
        });

        if (this.gatheringQueue.length > 0) {
            if (this.gatherings.length == 0 || this.gatherings[this.gatherings.length-1].progress > 0.4) {
                this.gatherings.push(this.gatheringQueue.shift());
            }
        }

        this.gatherings = this.gatherings.filter(gathering => gathering.progress < 1);

        if (this.isGathering) {
            this.progress += this.stats.gatheringSpeed * timeDelta;

            // console.log(`[ Log ] 플레이어의 수집 정도: ${this.progress}`);
            if (this.progress >= 1) {
                this.progress = 0;
                
                if (this.targetObject) {
                    const inventory = this.targetObject.findComponent(Inventory);

                    Object.keys(inventory.items).forEach(itemName => {
                        const itemCount = inventory.items[itemName];

                        this.inventory.addItems({
                            name: itemName,
                            count: itemCount,
                        });
        
                        this.gatheringQueue.push({
                            name: itemName,
                            count: itemCount,
                            progress: 0
                        });

                        console.log(`[ Log ] 플레이어가 ${itemName}을(를) ${itemCount}개 수집했다.`);
                    });

                    this.targetObject.remove();
                    this.targetObject = null;
                }

                this.isGathering = false;
            }
        }
    }

    onDraw(context) {
        context.save();

        this.gatherings.forEach(gathering => {
            const text = `${gathering.name} +${gathering.count}`;

            context.font = '24px serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = `rgba(255, 255, 255, ${1 - gathering.progress})`;
            context.fillText(text, 0, -gathering.progress * 20);
        });

        context.restore();

        if (this.isGathering) {
            const spriteRenderer = this.gameObject.findComponent(SpriteRenderer);
            const area = spriteRenderer.getSpriteArea();
            const areaBar = new Area(area.x, area.y + area.height, area.width, 10);
            const areaProgress = areaBar.copy();

            areaProgress.width *= this.progress;

            context.fillStyle = 'black';
            context.fillRect(...areaBar.toList());

            context.fillStyle = 'red';
            context.fillRect(...areaProgress.toList());
        }
        else {
            // targetobject가 있으면
            if (this.targetObject) {
                context.strokeStyle = 'red';

                context.beginPath();
    
                context.moveTo(...this.object.area.getPosition().toList());
                context.lineTo(...this.targetObject.area.getPosition().toList());
    
                context.stroke();
            }
        }
    }

    gather(targetObject) {
        this.targetObject = targetObject;
        this.isGathering = true;
        this.progress = 0;
    }

    cancel() {
        this.targetObject = null;
        this.isGathering = false;
        this.progress = 0;
    }
}