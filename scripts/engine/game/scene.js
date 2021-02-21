import { BaseObject } from './object.js';
import { Camera } from './camera.js';
import { Area } from '../math/geometry/area.js';



export class Scene extends BaseObject {
    constructor() {
        super();

        this.game = null;

        this.camera = null;

        this.reverseGameObjects = [];
        this.gameObjects = [];
    }

    init() {
        if (this._state === this._states.created) {
            for (const gameObject of this.gameObjects) {
                if (gameObject instanceof Camera) {
                    this.camera = gameObject;
                    break;
                }
            }
            
            if (!this.camera) {
                const camera = new Camera('camera');

                this.addGameObjects(camera);

                // camera.area = new Area(0, 0, this.game.engine.canvas.width, this.game.engine.canvas.height);
                camera.area = new Area(0, 0, 400, 400);

                this.camera = camera;
            }

            this.onInitialize();

            this.gameObjects.forEach(gameObject => {
                gameObject.scene = this;
                gameObject.init();
            });

            this._state = this._states.initialized;
        }
    }

    dispose() {
        if (this._state === this._states.initialized) {
            this.gameObjects.forEach(gameObject => {
                gameObject.dispose();
                gameObject.scene = null;
            });

            this.gameObjects = null;

            this.onDispose();
            this.camera = null;
            this.game = null;

            this._state = this._states.disposed;
        }
    }

    event(events) {
        if (this._state === this._states.initialized) {
            this.onEvent(events);

            this.gameObjects.forEach(gameObject => {
                gameObject.event(events);
            });
        }
    }

    update(timeDelta) {
        if (this._state === this._states.initialized) {
            this.onUpdate(timeDelta);

            this.gameObjects.forEach(gameObject => {
                gameObject.update(timeDelta);
            });
        }
    }

    draw(context) {
        if (this._state === this._states.initialized) {
            this.onDraw(context);
    
            const camera = this.camera;
    
            if (camera) {
                const scale = camera.scale;
                const positionCamera = camera.area.getPosition();
                const sizeCamera = camera.area.getSize();
    
                this.gameObjects
                    .map((gameObject, index) => [index, gameObject])
                    .sort((a, b) => {
                        const aForScreen = a[1].hasTag('Screen');
                        const bForScreen = b[1].hasTag('Screen');
    
                        if (!aForScreen == !bForScreen) {
                            return a[0] - b[0];
                        }
                        else if (aForScreen) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    })
                    .map(packed => packed[1])
                    .forEach(gameObject => {
                        context.save();
                        
                        if (!gameObject.hasTag('Screen')) {
                            context.scale(...scale.toList());
                            context.translate(...positionCamera.negate().add(sizeCamera.divide(2).floor()).toList());
                        }
    
                        gameObject.draw(context);
    
                        context.restore();
                    });
            }
        }
    }

    addGameObjects(...gameObjects) {
        if (this._state !== this._states.disposed) {
            this.gameObjects = this.gameObjects.concat(gameObjects);

            gameObjects.forEach(gameObject => {
                gameObject.scene = this;
                gameObject.onAdded();

                if (this._state === this._states.initialized) {
                    gameObject.init();
                }
            });

            this.reverseGameObjects = this.gameObjects.slice().reverse();
        }
    }

    removeGameObjects(...gameObjects) {
        this.gameObjects = this.gameObjects.filter(gameObject => {
            const result = !gameObjects.includes(gameObject);

            if (!result) {
                gameObject.scene = null;
                gameObject.onRemoved();
            }

            return result;
        });

        this.reverseGameObjects = this.gameObjects.slice().reverse();
    }

    findGameObjects(gameObjectName) {
        return this.gameObjects.filter(gameObject => gameObject.name === gameObjectName);
    }

    findGameObject(gameObjectName) {
        if (!gameObjectName) {
            throw new Error('gameObject 이름이 잘못되었습니다.');
        }

        for (const gameObject of this.gameObjects) {
            if (gameObject.name === gameObjectName) {
                return gameObject;
            }
        }

        return null;
    }

    async deserializeObject(serializedGameObject) {
		let serializedModule = serializedGameObject.module;
		let serializedType = serializedGameObject.type;

		if (!serializedModule || !serializedType) {
			serializedModule = '/scripts/engine/game/object.js';
			serializedType = 'GameObject';
		}

		const module = await import(serializedModule);
		const type = module[serializedType];

		const serializedName = serializedGameObject.name ?? '';
		const serializedEnable = serializedGameObject.enable ?? true;
		const serializedObjects = serializedGameObject.gameObjects ?? [];
		const serializedComponents = serializedGameObject.components ?? [];
		const serializedTags = serializedGameObject.tags ?? [];
		const onDeserialized = serializedGameObject.onDeserialized;

		const gameObject = new type();

		gameObject.name = serializedName;
		gameObject.enable = serializedEnable;

		const gameObjects = await Promise.all(
			serializedObjects.map(async object => await this.deserializeObject(object))
		);

		gameObject.addGameObjects(...gameObjects);
		
		const components = await Promise.all(
			serializedComponents.map(async component => await this.deserializeComponent(component))
		);

		gameObject.addComponents(...components);

		gameObject.addTags(...serializedTags);

		delete serializedGameObject['type'];
		delete serializedGameObject['name'];
		delete serializedGameObject['enable'];
		delete serializedGameObject['gameObjects'];
		delete serializedGameObject['components'];
		delete serializedGameObject['tags'];
		delete serializedGameObject['onDeserialized'];

		for (const propertyName in serializedGameObject) {
			const propertyValue = serializedGameObject[propertyName];
			
			gameObject[propertyName] = propertyValue;
		}

		if (onDeserialized) {
			onDeserialized(gameObject);
		}
	
		return gameObject;
	}

	async deserializeComponent(serializedComponent) {
		let serializedModule = serializedComponent.module;
		let serializedType = serializedComponent.type;

		const module = await import(serializedModule);
		const type = module[serializedType];

		const serializedEnable = serializedComponent.enable ?? true;
		const onDeserialized = serializedComponent.onDeserialized;

		const component = new type();

		component.enable = serializedEnable;

		delete serializedComponent['type'];
		delete serializedComponent['enable'];
		delete serializedComponent['onDeserialized'];

		for (const propertyName in serializedComponent) {
			const propertyValue = serializedComponent[propertyName];
			
			component[propertyName] = propertyValue;
		}

		if (onDeserialized) {
			onDeserialized(component);
		}

		return component;
	}

	static deserialize(serializedScene) {
		const scene = new this();

		return (async () => {
			for (const object of serializedScene.gameObjects) {
				const gameObject = await scene.deserializeObject(object);

				scene.addGameObjects(gameObject);
			}

            return scene;
		})();
	}
}