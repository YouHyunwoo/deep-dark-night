import { Component } from '../../engine/game/component.js';



export class Animator extends Component {
    constructor(name, animation) {
        super(name);

        this.animation = animation ?? null;
    }

    onInitialize() {
        this.spriteRenderer = this.owner.findComponents('SpriteRenderer')[0];
    }

    onUpdate(timeDelta) {
        if (this.animation) {
            this.animation.update(timeDelta);

            this.spriteRenderer.sprite = this.animation.getSprite();
        }
    }
}