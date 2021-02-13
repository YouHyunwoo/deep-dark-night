import { Component } from '../../../engine/game/component.js';
import { SpriteRenderer } from '../../../engine/graphic/components/spriteRenderer.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';
import { Stone, Tree } from '../data/objects.js';



export class ObjectGenerator extends Component {
    onInitialize() {
        const object = this.owner;
        const world = object.owner;
        const scene = world.scene;
        const game = scene.game;
        const engine = game.engine;
        const canvas = engine.canvas;

        this.object = object;
        this.game = game;
        this.canvas = canvas;

        this.layers = object.objects;
    }

    onUpdate(timeDelta) {
        if (Math.random() > 0.99) {
            this.generateStone(1);
        }

        if (Math.random() > 0.999) {
            this.generateTree(1);
        }
    }

    generateStone(count) {
        for (let i = 0; i < count; i++) {
            const object = new Stone();

            object.addTags('@ground');

            this.addGameObjects(object);

            object.area.x = Math.random() * this.canvas.width;
            object.area.y = Math.random() * this.canvas.height;

            const scale = Math.random() * 0.5 + 0.5;
            
            object.findComponent(SpriteRenderer).sprite.scale = Vector2.full(scale);
        }
    }

    generateTree(count) {
        for (let i = 0; i < count; i++) {
            const object = new Tree();

            object.addTags('@ground');
            
            this.addGameObjects(object);

            object.area.x = Math.random() * this.canvas.width;
            object.area.y = Math.random() * this.canvas.height;

            object.findComponent(SpriteRenderer).sprite.scale = Vector2.full(3);
        }
    }

    addGameObjects(...gameObjects) {
        gameObjects.forEach(gameObject => {
            for (const layer of this.layers) {
                if (gameObject.hasTag('@' + layer.name)) {
                    layer.addGameObjects(gameObject);
                    break;
                }
            }
        });
    }

    removeGameObjects(...gameObjects) {
        gameObjects.forEach(gameObject => {
            for (const layer of this.layers) {
                if (gameObject.hasTag('@' + layer.name)) {
                    layer.removeGameObjects(gameObject);
                }
            }
        });
    }
}