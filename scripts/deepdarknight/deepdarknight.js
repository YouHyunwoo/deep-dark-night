import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from '../data/components/world.js';
import { Gathering, Movement, Player, PlayerState, Inventory } from '../data/components/player.js';
import { SpriteRenderer } from '../data/components/spriteRenderer.js';
import { TimeSystem } from '../data/components/systems.js';
import { Animator } from '../data/components/animator.js';
import { aniCharacterIdleDown } from '../data/animations.js';



class DeepDarkNight extends Game {
    init() {
        this.scene.push(new GameScene());
    }
}

class GameScene extends Scene {
    onInitialize() {
        this.#createWorld();
        this.#createPlayer();
        this.#createTimeSystemObject();
    }

    #createWorld() {
        this.#createWorldObject();
        this.#addWorldComponent();
        this.#initializeWorld();
    }

    #createWorldObject() {
        this.world = new GameObject('world');
    }

    #addWorldComponent() {
        const world = new World('World', this.game);

        this.world.addComponents(world);
    }

    #initializeWorld() {
        this.addGameObject(this.world);

        this.world.init();
    }

    #createPlayer() {
        this.#createPlayerObject();
        this.#addPlayerComponent();
        this.#initializePlayer();
    }

    #createPlayerObject() {
        this.player = new GameObject('player');
    }

    #addPlayerComponent() {
        const player = new Player('Player', this.game);

        player.map = this.world.findComponents('World')[0].maps[0];

        this.player.addComponents(player);


        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

        this.player.addComponents(spriteRenderer);


        const animator = new Animator('Animator');

        animator.animation = aniCharacterIdleDown;

        this.player.addComponents(animator);
    

        const playerState = new PlayerState('State');

        this.player.addComponents(playerState);


        const movement = new Movement('Movement');

        this.player.addComponents(movement);


        const gathering = new Gathering('Gathering');

        this.player.addComponents(gathering);


        const inventory = new Inventory('Inventory');

        this.player.addComponents(inventory);
    }

    #initializePlayer() {
        this.player.width = 20;
        this.player.height = 16;

        this.addGameObject(this.player);

        this.player.init();
    }

    #createTimeSystemObject() {
        this.timeSystem = new GameObject('TimeSystem');

        const timeSystem = new TimeSystem('TimeSystem');

        this.timeSystem.addComponents(timeSystem);

        this.addGameObject(this.timeSystem);

        this.timeSystem.init();
    }
}


const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

const GlobalEngine = engine;
const GlobalGame = engine.game;
const GlobalScene = engine.game.scene;
const GlobalCamera = engine.game.camera;

engine.start();



export { GlobalEngine as Engine, GlobalGame as Game, GlobalScene as Scene, GlobalCamera as Camera };