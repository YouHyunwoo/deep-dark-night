export class Scene {
    constructor() {
        this.game = null;

        this.objects = [];
    }

    onInitialize() {}
    onDispose() {}

    onUpdate(timeDelta) {
        this.objects.forEach(object => {
            object.update(timeDelta);
        });
    }

    onDraw(context) {
        this.objects.forEach(object => {
            object.draw(context);
        });
    }
}