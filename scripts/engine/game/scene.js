export class Scene {
    constructor() {
        this._state = 'created';

        this.game = null;

        this.objects = [];
    }

    init() {
        if (this._state === 'created') {
            this.onInitialize();

            this.objects.forEach(object => {
                object.init();
            });

            this._state = 'initialized';
        }
    }

    dispose() {
        if (this._state === 'initialized') {
            this.objects.forEach(object => {
                object.dispose();
            });
    
            this.onDispose();

            this._state = 'disposed';
        }
    }

    event(events) {
        if (this._state === 'initialized') {
            this.onEvent(events);

            this.objects.slice().reverse().forEach(object => {
                object.event(events);
            });
        }
    }

    update(timeDelta) {
        if (this._state === 'initialized') {
            this.onUpdate(timeDelta);

            this.objects.forEach(object => {
                object.update(timeDelta);
            });
        }
    }

    draw(context) {
        context.save();

        this.onDraw(context);

        this.objects
            .map((object, index) => [index, object])
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
            .map(element => element[1])
            .forEach(object => {
                object.draw(context);
            });

        context.restore();
    }

    addGameObject(gameObject) {
        gameObject.scene = this;

        this.objects.push(gameObject);
    }

    removeGameObject(gameObject) {
        const index = this.objects.indexOf(gameObject);

        if (index >= 0) {
            this.objects.splice(index, 1);
        }
    }

    findGameObjects(gameObjectName) {
        return this.objects.filter(obj => obj.name === gameObjectName);
    }

    findGameObject(gameObjectName) {
        console.assert(gameObjectName);

        for (const object of this.objects) {
            if (object.name === gameObjectName) {
                return object;
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
		const serializedObjects = serializedGameObject.objects ?? [];
		const serializedComponents = serializedGameObject.components ?? [];
		const serializedTags = serializedGameObject.tags ?? [];
		const onDeserialized = serializedGameObject.onDeserialized;

		const gameObject = new type();

		gameObject.name = serializedName;
		gameObject.enable = serializedEnable;

		const objects = await Promise.all(
			serializedObjects.map(async object => await this.deserializeObject(object))
		);

		gameObject.addGameObjects(...objects);
		
		const components = await Promise.all(
			serializedComponents.map(async component => await this.deserializeComponent(component))
		);

		gameObject.addComponents(...components);

		gameObject.addTags(...serializedTags);

		delete serializedGameObject['type'];
		delete serializedGameObject['name'];
		delete serializedGameObject['enable'];
		delete serializedGameObject['objects'];
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
		const scene = new Scene();

		return (async () => {
			for (const object of serializedScene.objects) {
				const gameObject = await scene.deserializeObject(object);

				scene.addGameObject(gameObject);
			}

			scene.state = 'loaded';

            return scene;
		})();
	}

    onInitialize() {}
    onDispose() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}