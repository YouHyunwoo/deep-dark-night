import { Component } from '../../engine/game/component.js';
import { Vector2 } from '../../engine/math/geometry/vector.js';
import { Area } from '../../engine/math/geometry/area.js';



export class SpriteRenderer extends Component {
    constructor(name) {
        super(name);

        this.basePosition = Vector2.zeros();

        this.sprite = null;
    }

    onDraw(context) {
        if (this.sprite) {
            context.save();

            // this.#drawBlackRectangle(context);

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
        this.sprite?.draw(context, this.basePosition);
    }

    getSpriteArea() {
        return this.sprite?.getSpriteArea(this.basePosition) ?? Area.zeros();
    }
}