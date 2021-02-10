import { UIImage } from '../../../engine/game/ui/image.js';
import { UILabel } from '../../../engine/game/ui/label.js';
import { UIObject } from '../../../engine/game/ui/object.js';
import { Area } from '../../../engine/math/geometry/area.js';



export class UIItemSlot extends UIObject {
    constructor(name='ItemSlot') {
        super(name);

        this.backgroundColor = 'grey';
        this.borderColor = 'black';
        this.color = 'black';

        this.imageItemSprite = null;
        this.labelItemName = null;
        this.labelItemCount = null;

        this.itemSprite = null;
        this.itemName = null;
        this.itemCount = null;

        this.pointable = true;
        this.pointed = false;

        this.isDisabled = false;
    }

    onInitialize() {
        {
            const image = this.imageItemSprite = new UIImage('itemSprite', this.itemSprite);

            image.area = new Area(0, 0, this.area.width, this.area.height);
            image.imageAlign = 'center';
            image.imageBaseline = 'middle';

            this.addGameObjects(image);
        }

        {
            const label = this.labelItemName = new UILabel('itemName');

            label.area = new Area(1, 2, null, null);
            label.fitContentHorizontal = true;
            label.fitContentVertical = true;
            label.backgroundColor = null;
            label.text = this.itemName;
            label.color = this.color;
    
            this.addGameObjects(label);
        }

        {
            const label = this.labelItemCount = new UILabel('itemCount');

            label.area = new Area(0, 0, this.area.width-2, this.area.height);
            label.backgroundColor = null;
            label.text = this.itemCount;
            label.color = 'black';
            label.textAlign = 'right';
            label.textBaseline = 'bottom';
    
            this.addGameObjects(label);
        }
    }

    setItemName(itemName) {
        this.itemName = itemName;

        if (this.labelItemName) {
            this.labelItemName.text = itemName;
        }
    }

    setItemCount(itemCount) {
        this.itemCount = itemCount;

        if (this.labelItemCount) {
            this.labelItemCount.text = itemCount;
        }
    }

    setItemSprite(itemSprite) {
        this.itemSprite = itemSprite;

        if (this.imageItemSprite) {
            this.imageItemSprite.sprite = itemSprite;
        }
    }

    draw(context) {
        if (this.initialized && !this.disposed && this.enable && this.visible) {
            const sizeArea = this.area.getSize().toList();

            context.save();

            context.translate(...this.area.getPosition().toList());

            context.beginPath();
            context.rect(0, 0, ...sizeArea);
            context.clip();

            if (this.area.width > 0 && this.area.height > 0) {
                if (this.backgroundColor) {
                    context.fillStyle = this.backgroundColor;
                    context.fillRect(0, 0, ...sizeArea);
    
                    this.onDraw(context);

                    this.components.forEach(component => {
                        component.onDraw(context);
                    });

                    this.objects.forEach(object => {
                        object.draw(context);
                    });
                    
                    if (this.isDisabled) {
                        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        context.fillRect(0, 0, ...sizeArea);
                    }
                    else {
                        if (this.pointed) {
                            context.fillStyle = 'rgba(255, 255, 255, 0.2)';
                            context.fillRect(0, 0, ...sizeArea);
                        }
                    }
                }
        
                if (this.borderColor) {
                    context.strokeStyle = this.borderColor;
                    context.strokeRect(0, 0, ...sizeArea);
                }
            }

            context.restore();
        }
    }

    onMouseIn(event) {
        if (this.pointable) {
            this.pointed = true;
        }
    }

    onMouseOut(event) {
        this.pointed = false;
    }

    onClick(event) {
        // this.isDisabled = !this.isDisabled;
    }
}