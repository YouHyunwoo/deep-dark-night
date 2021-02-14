import { UIObject } from './object.js';
import { Vector2 } from '../../math/geometry/vector.js';



export class UIImage extends UIObject {
    constructor(name='UIImage', sprite) {
        super(name);

        this.drawType = 'original';

        this.backgroundColor = null;
        this.borderColor = null;
        
        this.sprite = sprite;

        this.imageAlign = 'left';
        this.imageBaseline = 'top';
    }

    onDraw(context) {
        if (this.area.width !== 0 && this.area.height !== 0 && this.sprite) {
            const sizeContent = this.getContentSize(context);

            this.beginClipping(context, sizeContent);

            this.drawBackground(context, sizeContent);
            this.drawSprite(context, sizeContent);
            this.drawBorder(context, sizeContent);

            this.endClipping(context);
        }
    }

    getContentSize() {
        const sizeContent = this.area.getSize();

        if (sizeContent.x < 0 || sizeContent.y < 0) {
            const areaSprite = this.sprite.getSpriteArea();

            if (sizeContent.x < 0) {
                sizeContent.x = areaSprite.width;
            }

            if (sizeContent.y < 0) {
                sizeContent.y = areaSprite.height;
            }
        }

        return sizeContent;
    }

    beginClipping(context, sizeContent) {
        context.save();

        context.beginPath();
        context.rect(0, 0, ...sizeContent.toList());
        context.clip();
    }

    drawBackground(context, sizeContent) {
        if (this.backgroundColor) {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, ...sizeContent.toList());
        }
    }

    drawSprite(context, sizeContent) {
        if (this.sprite?.isDrawable()) {
            if (this.drawType === 'original') {
                const positionImage = this.getImagePosition(sizeContent);

                this.sprite.draw(context, positionImage);
            }
            else if (this.drawType === 'stretch') {
                this.sprite.draw(context, Vector2.zeros(), sizeContent);
            }
        }
    }

    getImagePosition(sizeContent) {
        const areaSprite = this.sprite.getSpriteArea();

        const horizontal = {
            left: 0,
            center: (sizeContent.x - areaSprite.width) / 2,
            right: sizeContent.x - areaSprite.width
        };

        const vertical = {
            top: 0,
            middle: (sizeContent.y - areaSprite.height) / 2,
            bottom: sizeContent.y - areaSprite.height
        }

        const positionHorizontal = horizontal[this.imageAlign];
        const positionVertical = vertical[this.imageBaseline];

        const position = new Vector2(positionHorizontal, positionVertical);

        return position;
    }

    drawBorder(context, sizeContent) {
        if (this.borderColor) {
            context.strokeStyle = this.borderColor;
            context.strokeRect(0, 0, ...sizeContent.toList());
        }
    }

    endClipping(context) {
        context.restore();
    }
}