export class Scene {
    constructor() {
        this.game = null;

        this.objects = [];
    }

    init() {
        this.onInitialize();

        this.objects.forEach(object => {
            object.init();
        });
    }

    dispose() {
        this.objects.forEach(object => {
            object.dispose();
        });

        this.onDispose();
    }

    update(timeDelta) {
        this.onUpdate(timeDelta);

        this.objects.forEach(obj => obj.update(timeDelta));
    }

    draw(context) {
        context.save();

        this.onDraw(context);

        this.objects
            .map((object, index) => [index, object])
            .sort((a, b) => {
                const aForScreen = a[1].hasTag('Screen');
                const bForScreen = b[1].hasTag('Screen');

                if (!aForScreen == !bForScreen) {
                    return a[0] - b[0];
                }
                else if (aForScreen) {
                    return 1;
                }
                else {
                    return -1;
                }
            })
            .map(element => element[1])
            .forEach(object => {
                object.draw(context);
            });

        context.restore();
    }

    addGameObject(gameObject) {
        gameObject.scene = this;

        this.objects.push(gameObject);
    }

    removeGameObject(gameObject) {
        const index = this.objects.indexOf(gameObject);

        if (index >= 0) {
            this.objects.splice(index, 1);
        }
    }

    findGameObjects(gameObjectName) {
        return this.objects.filter(obj => obj.name === gameObjectName);
    }

    findGameObject(gameObjectName) {
        console.assert(gameObjectName);

        for (const object of this.objects) {
            if (object.name === gameObjectName) {
                return object;
            }
        }

        return null;
    }

    onInitialize() {}
    onDispose() {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}