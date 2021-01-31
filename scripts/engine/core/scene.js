export class Scene {
    constructor(game) {
        this.game = game;

        this.scenes = [];
    }

    push(scene) {
        console.assert(!!scene);

        this.scenes.unshift(scene);

        scene.game = this.game;
        scene.onInitialize();
    }

    pop() {
        const scene = this.scenes.shift();

        if (scene) {
            scene.game = null;
            scene.onDispose();
        }
        
        
        return scene;
    }

    transit(scene) {
        this.pop();
        this.push(scene);
    }

    update(timeDelta) {
        this.scenes[0].onUpdate(timeDelta);
    }

    draw(context) {
        this.scenes[0].onDraw(context);
    }
}