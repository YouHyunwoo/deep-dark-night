export class Item {
    constructor(name, description, sprite, type, mix, capability) {
        this.name = name;
        this.description = description;
        this.sprite = sprite;
        this.type = type;
        this.mix = mix;
        this.capability = capability;
    }

    clone() {
        const item = new Item(this.name, this.description, this.sprite, this.type, this.mix, this.capability);

        return item;
    }
}