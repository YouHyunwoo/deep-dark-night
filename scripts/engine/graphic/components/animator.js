import { Component } from '../../game/component.js';
import { SpriteRenderer } from './spriteRenderer.js';



export class Animator extends Component {
    constructor(name, animation) {
        super(name);

        this.animation = animation ?? null;
    }

    onInitialize() {
        this.spriteRenderer = this.owner.findComponent(SpriteRenderer);
    }

    onUpdate(timeDelta) {
        if (this.animation) {
            this.animation.update(timeDelta);

            this.spriteRenderer.sprite = this.animation.getSprite();
        }
    }
}