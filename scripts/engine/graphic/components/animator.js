import { Component } from '../../game/component.js';
import { SpriteRenderer } from './spriteRenderer.js';



export class Animator extends Component {
    constructor() {
        super();

        this.animation = null;
    }

    onInitialize() {
        this.spriteRenderer = this.gameObject.findComponent(SpriteRenderer);
    }

    onUpdate(timeDelta) {
        if (this.animation) {
            this.animation.update(timeDelta);

            this.spriteRenderer.sprite = this.animation.getSprite();
        }
    }
}