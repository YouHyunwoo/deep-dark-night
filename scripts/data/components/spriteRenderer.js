import { Component } from '../../engine/game/component.js';
import { Area } from '../../engine/math/geometry/area.js';
import { Vector2 } from '../../engine/math/geometry/vector.js';



export class SpriteRenderer extends Component {
    constructor(name) {
        super(name);

        this.basePosition = Vector2.zeros();

        this.animation = null;
        this.sprite = null;
    }

    onUpdate(timeDelta) {
        if (this.animation) {
            this.animation.update(timeDelta);
            this.sprite = this.animation.getSprite();
        }
    }

    onDraw(context) {
        if (this.sprite) {
            context.save();

            this.#drawBlackRectangle(context);

            this.#drawSprite(context);
    
            context.restore();
        }
    }

    #drawBlackRectangle(context) {
        const obj = this.owner;

        const area = new Area(-obj.width / 2, -obj.height / 2, obj.width, obj.height);

        context.save();

        context.fillStyle = 'black';
        context.fillRect(...area.toList());

        context.restore();
    }

    #drawSprite(context) {
        this.sprite.draw(context, this.basePosition);
    }

    getSpriteArea() {
        return this.sprite?.getSpriteArea(this.basePosition);
    }
}