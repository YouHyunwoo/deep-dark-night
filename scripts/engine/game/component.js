export class Component {
    constructor(name='') {
        this.owner = null;

        this.name = name;
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}