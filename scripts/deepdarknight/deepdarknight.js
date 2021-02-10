import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from './asset/world/world.js';
import { Map } from './asset/map/map.js';
import { ObjectSort } from './asset/map/objectSort.js';
import { ObjectGenerator } from './asset/map/objectGenerator.js';
import { Player } from './asset/player/player.js';
import { Movement } from './asset/character/movement.js';
import { Direction } from './asset/character/direction.js';
import { Gathering } from './asset/character/gathering.js';
import { Inventory } from './asset/character/inventory.js';
import { Stone, Tree } from './asset/data/objects.js';
import { SpriteRenderer } from '../engine/graphic/components/spriteRenderer.js';
import { Animator } from '../engine/graphic/components/animator.js';
import { StateContext } from '../engine/util/components/state.js';
import { IdleState } from './asset/player/state/idle.js';
import { MoveState } from './asset/player/state/move.js';
import { GatherState } from './asset/player/state/gather.js';
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
        this.#addWorldToScene();
        this.#addTimeSystemToScene();
        this.#addUISystemToScene();
    }

    #addWorldToScene() {
        const canvas = this.game.engine.canvas;

        this.world = new GameObject('world');

        {
            // const componentWorld = new World('World');

            // this.world.addComponents(componentWorld);


            const map = new GameObject('map');

            map.area = new Area(0, 0, 800, 800);

            {
                const componentMap = new Map('Map');

                map.addComponents(componentMap);

                const componentObjectSort = new ObjectSort('ObjectSort');

                map.addComponents(componentObjectSort);

                const componentObjectGenerator = new ObjectGenerator('ObjectGenerator');

                map.addComponents(componentObjectGenerator);
            }
            {
                const layerGround = new GameObject('ground');

                {
                    const player = this.player = new GameObject('player');

                    player.area = new Area(100, 100, 20, 16);

                    player.addTags('@ground');

                    {
                        const componentPlayer = new Player('Player', this.game);

                        componentPlayer.map = map;

                        player.addComponents(componentPlayer);


                        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

                        player.addComponents(spriteRenderer);


                        const animator = new Animator('Animator');

                        player.addComponents(animator);


                        const direction = new Direction('Direction');

                        player.addComponents(direction);


                        const movement = new Movement('Movement');

                        player.addComponents(movement);


                        const gathering = new Gathering('Gathering');

                        player.addComponents(gathering);


                        const inventory = new Inventory('Inventory');

                        player.addComponents(inventory);
                    }
                    {
                        const state = new GameObject('state');

                        {
                            const stateContext = new StateContext('StateContext');

                            state.addComponents(stateContext);
                        }
                        {
                            const idle = new GameObject('idle');

                            {
                                const stateIdle = new IdleState('State');

                                idle.addComponents(stateIdle);
                            }

                            state.addGameObjects(idle);

                            const move = new GameObject('move');

                            {
                                const stateMove = new MoveState('State');

                                move.addComponents(stateMove);
                            }

                            state.addGameObjects(move);

                            const gather = new GameObject('gather');

                            {
                                const stateGather = new GatherState('State');

                                gather.addComponents(stateGather);
                            }

                            state.addGameObjects(gather);
                        }

                        player.addGameObjects(state);
                    }

                    layerGround.addGameObjects(player);


                    const stoneCount = ~~(Math.random() * 10);

                    for (let i = 0; i < stoneCount; i++) {
                        const object = new Stone('돌');
            
                        object.addTags('@ground');
            
                        object.area.x = Math.random() * canvas.width;
                        object.area.y = Math.random() * canvas.height;
            
                        object.init();
            
                        const scale = Math.random() * 0.5 + 0.5;
            
                        object.findComponent('SpriteRenderer').sprite.scale = Vector2.full(scale);
            
                        layerGround.addGameObjects(object);
                    }


                    const treeCount = ~~(Math.random() * 5);

                    for (let i = 0; i < treeCount; i++) {
                        const object = new Tree('나무');
            
                        object.addTags('@ground');
            
                        object.area.x = Math.random() * canvas.width;
                        object.area.y = Math.random() * canvas.height;
            
                        object.init();
            
                        object.findComponent('SpriteRenderer').sprite.scale = Vector2.full(3);
            
                        layerGround.addGameObjects(object);
                    }
                }

                map.addGameObjects(layerGround);


                const layerSky = new GameObject('sky');

                map.addGameObjects(layerSky);
            }
            
            this.world.addGameObjects(map);
        }

        this.addGameObject(this.world);
    }

    #addTimeSystemToScene() {
        this.timeSystem = new GameObject('timeSystem');

        this.addGameObject(this.timeSystem);

        {
            const componentTimeSystem = new TimeSystem('TimeSystem');

            this.timeSystem.addComponents(componentTimeSystem);
        }
    }

    #addUISystemToScene() {
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