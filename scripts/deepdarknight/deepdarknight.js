import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { sceneData } from './scene/game.js';



class DeepDarkNight extends Game {
    init() {
        Scene.deserialize(sceneData).then(scene => {
            const player = scene
                .findGameObject('world')
                .findGameObject('map')
                .findGameObject('ground')
                .findGameObject('player');

            scene.player = player;
            
            this.scene.push(scene);
        });
    }
}



const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

engine.start();