import { Engine } from '../engine/core/engine.js';
import { Game } from '../engine/core/game.js';
import { Scene } from '../engine/game/scene.js';
import { GameObject } from '../engine/game/object.js';
import { World } from '../data/components/world.js';
import { Map } from '../data/components/map.js';
import { ObjectSort } from '../data/components/objectSort.js';
import { ObjectGenerator } from '../data/components/objectGenerator.js';
import { Gathering, Movement, Player, PlayerState } from '../data/components/player.js';
import { Inventory } from '../data/components/character/inventory.js';
import { Stone, Tree } from '../data/objects.js';
import { SpriteRenderer } from '../data/components/spriteRenderer.js';
import { Animator } from '../data/components/animator.js';
import { aniCharacterIdleDown } from '../data/animations.js';
import { Vector2 } from '../engine/math/geometry/vector.js';
import { Area } from '../engine/math/geometry/area.js';
import { TimeSystem } from '../data/components/timeSystem.js';



class DeepDarkNight extends Game {
    init() {
        this.scene.push(new GameScene());
    }
}

class GameScene extends Scene {
    onInitialize() {
        this.#addWorldToScene();
        this.#addTimeSystemToScene();
        // this.#addUISystemToScene();
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


                const layerGround = new GameObject('ground');

                {
                    const player = this.player = new GameObject('player');

                    player.width = 20;
                    player.height = 16;

                    player.addTags('@ground');

                    {
                        const componentPlayer = new Player('Player', this.game);

                        componentPlayer.map = map;

                        player.addComponents(componentPlayer);


                        const spriteRenderer = new SpriteRenderer('SpriteRenderer');

                        player.addComponents(spriteRenderer);


                        const animator = new Animator('Animator');

                        animator.animation = aniCharacterIdleDown;

                        player.addComponents(animator);
                    

                        const playerState = new PlayerState('State');

                        player.addComponents(playerState);


                        const movement = new Movement('Movement');

                        player.addComponents(movement);


                        const gathering = new Gathering('Gathering');

                        player.addComponents(gathering);


                        const inventory = new Inventory('Inventory');

                        player.addComponents(inventory);
                    }

                    layerGround.addGameObjects(player);


                    // const stoneCount = ~~(Math.random() * 10);

                    // for (let i = 0; i < stoneCount; i++) {
                    //     const object = new Stone('stone');
            
                    //     object.addTags('@ground');
            
                    //     object.area.x = Math.random() * canvas.width;
                    //     object.area.y = Math.random() * canvas.height;
            
                    //     object.init();
            
                    //     const scale = Math.random() * 0.5 + 0.5;
            
                    //     object.findComponents('SpriteRenderer')[0].sprite.scale = Vector2.full(scale);
            
                    //     layerGround.addGameObjects(object);
                    // }


                    const treeCount = ~~(Math.random() * 5);

                    for (let i = 0; i < treeCount; i++) {
                        const object = new Tree('tree');
            
                        object.addTags('@ground');
            
                        object.area.x = Math.random() * canvas.width;
                        object.area.y = Math.random() * canvas.height;
            
                        object.init();
            
                        object.findComponents('SpriteRenderer')[0].sprite.scale = Vector2.full(3);
            
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

        this.world.init();
    }

    #addTimeSystemToScene() {
        this.timeSystem = new GameObject('timeSystem');

        {
            const componentTimeSystem = new TimeSystem('TimeSystem');

            this.timeSystem.addComponents(componentTimeSystem);
        }

        this.addGameObject(this.timeSystem);

        this.timeSystem.init();
    }

    #addUISystemToScene() {
        this.uiSystem = new GameObject('uiSystem');

        {
            const componentUISystem = new UISystem('UISystem');

            this.uiSystem.addComponents(componentUISystem);
        }

        this.addGameObject(this.uiSystem);

        this.uiSystem.init();
    }
}


const engine = new Engine();

engine.init();

engine.game = new DeepDarkNight(engine);

engine.start();