import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from '../data/components/world.js';
import { Map } from '../data/components/map.js';
import { ObjectSort } from '../data/components/objectSort.js';
import { ObjectGenerator } from '../data/components/objectGenerator.js';
import { Player } from '../data/components/player/player.js';
import { Movement } from '../data/components/character/movement.js';
import { Direction } from '../data/components/character/direction.js';
import { Gathering } from '../data/components/character/gathering.js';
import { Stone, Tree } from '../data/objects.js';
import { SpriteRenderer } from '../data/components/spriteRenderer.js';
import { Animator } from '../data/components/animator.js';
import { Inventory } from '../data/components/character/inventory.js';
import { StateContext } from '../data/components/state.js';
import { IdleState } from '../data/components/player/state/idle.js';
import { MoveState } from '../data/components/player/state/move.js';
import { GatherState } from '../data/components/player/state/gather.js';
import { Vector2 } from '../engine/math/geometry/vector.js';
import { Area } from '../engine/math/geometry/area.js';
import { TimeSystem } from '../data/components/timeSystem.js';
import { UISystem } from '../engine/game/ui/system.js';
import { MixWindow } from './asset/objects/ui/mix.js';
import { InventoryWindow } from './asset/objects/ui/inventory.js';




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
            const goInventoryWindow = new InventoryWindow();

            goInventoryWindow.area = new Area(600, 100, 250, 400);
            goInventoryWindow.visible = false;

            this.uiSystem.addGameObjects(goInventoryWindow);
            
            const goMixWindow = new MixWindow();

            goMixWindow.area = new Area(100, 100, 250, 300);
            goMixWindow.visible = false;

            this.uiSystem.addGameObjects(goMixWindow);
        }
    }
}


const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

engine.start();