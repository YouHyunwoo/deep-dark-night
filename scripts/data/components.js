import { Component } from '../component.js';



export class SpriteRenderer extends Component {
    constructor(name) {
        super(name);

        this.sprite = null;
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

        const area = [
            -obj.width / 2,
            -obj.height / 2,
            obj.width,
            obj.height
        ]

        context.save();

        context.fillStyle = 'black';
        context.fillRect(...area);

        context.restore();
    }

    #drawSprite(context) {
        this.sprite.draw(context);
    }

    getSpriteArea() {
        const obj = this.owner;

        return this.sprite?.getSpriteArea(obj.x, obj.y);
    }
}