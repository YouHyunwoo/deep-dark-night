import { Component } from '../../../engine/game/component.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Inventory } from './inventory.js';


export class Gathering extends Component {
    constructor(name) {
        super(name);

        this.gatherings = [];
        
        this.targetObject = null;

        this.isGathering = false;

        this.progress = 0;
        this.range = 20;
        this.speed = 1;
    }

    onInitialize() {
        const goCharacter = this.owner;

        this.object = goCharacter;
        this.inventory = goCharacter.findComponent(Inventory);
    }

    onUpdate(timeDelta) {
        this.gatherings.forEach(gathering => {
            gathering.progress += timeDelta;
        });

        this.gatherings = this.gatherings.filter(gathering => gathering.progress < 1);

        if (this.isGathering) {
            this.progress += this.speed * timeDelta;

            // console.log(`[ Log ] 플레이어의 수집 정도: ${this.progress}`);
            if (this.progress >= 1) {
                this.progress = 0;
                
                if (this.targetObject) {
                    const itemName = this.targetObject.name;
                    const itemCount = Math.floor(this.targetObject.findComponent(SpriteRenderer).sprite.scale.x + 1 + Math.random() * 3);

                    this.inventory.addItems({
                        name: itemName,
                        count: itemCount,
                    });
    
                    this.gatherings.push({
                        name: itemName,
                        count: itemCount,
                        progress: 0
                    });
    
                    console.log(`[ Log ] 플레이어가 ${itemName}을(를) ${itemCount}개 수집했다.`);
    
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
            const spriteRenderer = this.owner.findComponent(SpriteRenderer);
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