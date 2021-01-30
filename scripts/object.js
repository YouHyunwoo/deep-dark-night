export class GameObject {
    constructor(name) {
        this.map = null;

        this.name = name;
        this.tags = [];

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.sprite = null;
    }

    addTags(...tags) {
        this.tags = this.tags.concat(tags);
    }

    removeTags(...tags) {
        this.tags = this.tags.filter(tag => !tags.includes(tag));
    }

    containsTag(tag) {
        return this.tags.includes(tag);
    }

    remove() {
        this.map?.removeGameObject(this);
    }

    draw(context) {
        if (this.#isDrawableSprite()) {
            this.#drawSprite(context);
        }
        else {
            this.#drawBlackRectangle(context);
        }
    }

    #isDrawableSprite() {
        return this.sprite?.isDrawable();
    }

    #drawSprite(context) {
        this.sprite?.draw(context, this.x, this.y);
    }

    #drawBlackRectangle(context) {
        context.save();

        context.fillStyle = 'black';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        context.restore();
    }

    getSpriteArea() {
        return this.sprite?.getSpriteArea(this.x, this.y);
    }
}