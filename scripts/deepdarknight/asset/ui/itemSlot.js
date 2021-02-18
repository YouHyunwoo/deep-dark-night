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

        this.imageItemSprite = new UIImage('itemSprite', null);
        this.labelItemName = new UILabel('itemName');
        this.labelItemCount = new UILabel('itemCount');

        Object.defineProperty(this, 'itemName', {
            get() {
                return this.labelItemName.text;
            },

            set(value) {
                this.labelItemName.text = value;
            }
        });

        Object.defineProperty(this, 'itemCount', {
            get() {
                return this.labelItemCount.text;
            },

            set(value) {
                this.labelItemCount.text = value;
            }
        });

        Object.defineProperty(this, 'itemSprite', {
            get() {
                return this.imageItemSprite.sprite;
            },

            set(value) {
                this.imageItemSprite.sprite = value;
            }
        });

        this.pointable = true;
        this.pointed = false;

        this.isDisabled = false;
    }

    onInitialize() {
        {
            const image = this.imageItemSprite;

            image.area = new Area(0, 0, this.area.width, this.area.height);
            image.imageAlign = 'center';
            image.imageBaseline = 'middle';

            this.addGameObjects(image);
        }

        {
            const label = this.labelItemName;

            label.area = new Area(1, 2, null, null);
            label.fitContentHorizontal = true;
            label.fitContentVertical = true;
            label.backgroundColor = null;
            label.color = this.color;
    
            this.addGameObjects(label);
        }

        {
            const label = this.labelItemCount;

            label.area = new Area(0, 0, this.area.width-2, this.area.height);
            label.backgroundColor = null;
            label.color = 'black';
            label.textAlign = 'right';
            label.textBaseline = 'bottom';
    
            this.addGameObjects(label);
        }
    }

    reset() {
        this.itemSprite = null;
        this.itemName = null;
        this.itemCount = null;
    }

    setItemName(itemName) {
        this.itemName = itemName;
    }

    setItemCount(itemCount) {
        this.itemCount = itemCount;
    }

    setItemSprite(itemSprite) {
        this.itemSprite = itemSprite;
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
                        if (this.pointable && this.pointed) {
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

        this.events.notify('click', event, this);
    }
}