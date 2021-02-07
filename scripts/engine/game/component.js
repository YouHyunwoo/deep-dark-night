export class Component {
    constructor(name='') {
        this.owner = null;

        this.name = name;
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}