export class Item {
    constructor(name, description, sprite, type, mix) {
        this.name = name;
        this.description = description;
        this.sprite = sprite;
        this.type = type;
        this.mix = mix;
    }

    clone() {
        const item = new Item(this.name, this.description, this.sprite, this.type, this.mix);

        return item;
    }
}