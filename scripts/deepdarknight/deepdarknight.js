import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from '../data/components/world.js';
import { Sprite } from '../engine/graphic/sprite.js';
import { Gathering, Movement, Player, PlayerState, Inventory } from '../data/components/player.js';
import { SpriteRenderer } from '../data/components/spriteRenderer.js';
import { character as characterSpriteSheet } from '../data/sprites.js';
import { Area } from '../engine/math/geometry/area.js';
import { Vector2 } from '../engine/math/geometry/vector.js';



class DeepDarkNight extends Game {
    init() {
        this.scene.push(new GameScene());
    }
}

class GameScene extends Scene {
    onInitialize() {
        this.#createWorld();
        this.#createPlayer();
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
        this.world.init();

        this.objects.push(this.world);
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

        const sprite = spriteRenderer.sprite = new Sprite(characterSpriteSheet);

        sprite.cropInOriginalImage = new Area(0, 5 / 8, 1 / 4, 1 / 8);
        sprite.scale = Vector2.full(2);
        sprite.anchor = new Vector2(0.5, 0.9);

        this.player.addComponents(spriteRenderer);
    

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

        this.player.init();

        this.objects.push(this.player);
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