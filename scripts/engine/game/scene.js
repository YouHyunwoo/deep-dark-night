export class Scene {
    constructor() {
        this.game = null;

        this.objects = [];
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

    onInitialize() {}
    onDispose() {}

    onUpdate(timeDelta) {
        this.objects.forEach(object => {
            object.update(timeDelta);
        });
    }

    onDraw(context) {
        this.objects
            .map((object, index) => [index, object])
            .sort((a, b) => {
                const aForScreen = a[1].containsTag('Screen');
                const bForScreen = b[1].containsTag('Screen');

                if (aForScreen && bForScreen || !aForScreen && !bForScreen) {
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
    }
}