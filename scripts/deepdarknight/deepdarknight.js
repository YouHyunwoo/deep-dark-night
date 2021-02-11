import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from './asset/world/world.js';
import { Map } from './asset/map/map.js';
import { Player } from './asset/player/player.js';
import { Stone, Tree } from './asset/data/objects.js';
import { Vector2 } from '../engine/math/geometry/vector.js';
import { Area } from '../engine/math/geometry/area.js';
import { TimeSystem } from './asset/system/timeSystem.js';
import { UISystem } from '../engine/game/ui/system.js';
import { InventoryWindow } from './asset/ui/inventory.js';
import { MixWindow } from './asset/ui/mix.js';



class DeepDarkNight extends Game {
    init() {
        this.scene.push(new GameScene());
    }
}

class GameScene extends Scene {
    onInitialize() {
        this.addWorldToScene();
        this.addPlayerToScene();
        this.addStoneInWorld();
        this.addTreeInWorld();
        this.addTimeSystemToScene();
        this.addUISystemToScene();
    }

    addWorldToScene() {
        this.world = new GameObject('world');

        this.addGameObject(this.world);
        {
            // const componentWorld = new World('World');

            // this.world.addComponents(componentWorld);


            const map = this.map = new Map('map');

            this.world.addGameObjects(map);

            map.area = new Area(0, 0, 800, 800);
        }
    }

    addPlayerToScene() {
        const map = this.world.findGameObject('map');
        const layerGround = map.findGameObject('ground');

        const player = this.player = new Player('player');

        layerGround.addGameObjects(player);

        player.area = new Area(100, 100, 20, 16);

        player.addTags('@ground');
    }

    addStoneInWorld() {
        const map = this.world.findGameObject('map');
        const layerGround = map.findGameObject('ground');

        const stoneCount = ~~(Math.random() * 10);

        for (let i = 0; i < stoneCount; i++) {
            const object = new Stone();

            object.addTags('@ground');

            object.area.x = Math.random() * map.area.width;
            object.area.y = Math.random() * map.area.height;

            object.init();

            const scale = Math.random() * 0.5 + 0.5;

            object.findComponent('SpriteRenderer').sprite.scale = Vector2.full(scale);

            layerGround.addGameObjects(object);
        }
    }

    addTreeInWorld() {
        const map = this.world.findGameObject('map');
        const layerGround = map.findGameObject('ground');

        const treeCount = ~~(Math.random() * 5);

        for (let i = 0; i < treeCount; i++) {
            const object = new Tree();

            object.addTags('@ground');

            object.area.x = Math.random() * map.area.width;
            object.area.y = Math.random() * map.area.height;

            object.init();

            object.findComponent('SpriteRenderer').sprite.scale = Vector2.full(3);

            layerGround.addGameObjects(object);
        }
    }

    addTimeSystemToScene() {
        this.timeSystem = new GameObject('timeSystem');

        this.addGameObject(this.timeSystem);

        {
            const componentTimeSystem = new TimeSystem('TimeSystem');

            this.timeSystem.addComponents(componentTimeSystem);
        }
    }

    addUISystemToScene() {
        this.uiSystem = new UISystem('uiSystem');

        this.addGameObject(this.uiSystem);

        {
            const inventoryWindow = new InventoryWindow();

            inventoryWindow.area = new Area(600, 100, 250, 400);
            inventoryWindow.visible = false;

            this.uiSystem.addGameObjects(inventoryWindow);
            
            const mixWindow = new MixWindow();

            mixWindow.area = new Area(100, 100, 250, 300);
            mixWindow.visible = false;

            this.uiSystem.addGameObjects(mixWindow);
        }
    }
}


const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

engine.start();