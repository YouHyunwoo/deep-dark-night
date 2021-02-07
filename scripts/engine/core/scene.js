export class Scene {
    constructor(game) {
        this.game = game;

        this.scenes = [];
    }

    push(scene) {
        console.assert(!!scene);

        this.scenes.unshift(scene);

        scene.game = this.game;
        scene.init();
    }

    pop() {
        const scene = this.scenes.shift();

        if (scene) {
            scene.game = null;
            scene.dispose();
        }
        
        
        return scene;
    }

    transit(scene) {
        this.pop();
        this.push(scene);
    }

    event(events) {
        this.scenes[0].event(events);
    }

    update(timeDelta) {
        this.scenes[0].update(timeDelta);
    }

    draw(context) {
        this.scenes[0].draw(context);
    }
}