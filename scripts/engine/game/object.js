import { Area } from '../math/geometry/area.js';
import { Event } from '../util/event.js';


export class BaseObject {
    constructor() {
        this._states = {
            created: 0,
            initialized: 1,
            disposed: 2,
        };
        this._state = 0;

        this._owner = null;

        this._enable = true;

        Object.defineProperty(this, 'enable', {
            get() {
                return this._enable;
            },
            set(value) {
                value = !!value;

                if (this._enable !== value) {
                    if (value) {
                        this.onEnabled();
                    }
                    else {
                        this.onDisabled();
                    }
                    
                    this._enable = value;
                }
            }
        });

        this._events = new Event();

        Object.defineProperty(this, 'events', {
            get() {
                return this._events;
            },
        });
    }

    init() {
        if (this._state === this._states.created) {
            this.onInitialize();

            if (this._enable) {
                this.onEnabled();
            }
            else {
                this.onDisabled();
            }

            this._state = this._states.initialized;
        }
    }

    dispose() {
        if (this._state === this._states.initialized) {
            this.onDisabled();
            this.onDispose();

            this._state = this._states.disposed;
        }
    }

    event(events) {
        if (this._state === this._states.initialized && this._enable) {
            this.onEvent(events);
        }
    }

    update(timeDelta) {
        if (this._state === this._states.initialized && this._enable) {
            this.onUpdate(timeDelta);
        }
    }

    draw(context) {
        if (this._state === this._states.initialized && this._enable) {
            this.onDraw(context);
        }
    }

    _bindOwner(owner) {
        this._owner = owner;
        this.onAdded();
    }

    _unbindOwner() {
        this.onRemoved();
        this._owner = null;
    }

    onInitialize() {}
    onDispose() {}
    onEnabled() {}
    onDisabled() {}
    onAdded() {}
    onRemoved() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}

export class GameObject extends BaseObject {
    constructor(name) {
        super();

        Object.defineProperty(this, 'parent', {
            get() {
                return this._owner;
            },
        });

        Object.defineProperty(this, 'bindParent', {
            get() {
                return this._bindOwner;
            },
        });

        Object.defineProperty(this, 'unbindParent', {
            get() {
                return this._unbindOwner;
            },
        });

        this.scene = null;

        this.name = name ?? '';
        this.components = [];
        this.tags = [];

        this.reverseGameObjects = [];
        this.gameObjects = [];

        this.area = Area.zeros();
    }

    addComponents(...components) {
        if (this._state !== this._states.disposed) {
            for (const component of components) {
                const componentType = component.constructor;

                if (this.hasComponent(componentType)) {
                    continue;
                }

                this.components.push(component);

                component.bindGameObject(this);

                if (this.initialized) {
                    component.onInitialize();
                }
            }
        }
    }

    removeComponents(...components) {
        this.components = this.components.filter(component => {
            const result = !components.includes(component);

            if (!result) {
                component.unbindGameObject();
            }

            return result;
        });
    }

    removeComponentsByType(...componentTypes) {
        componentTypes.forEach(componentType => {
            for (const component of this.components) {
                if (component.constructor.name === componentType) {
                    this.removeComponents(component);
                    break;
                }
            }
        });
    }

    hasComponent(componentType) {
        return this.components.some(component => component.constructor.name === componentType.name);
    }

    findComponent(componentType) {
        if (!componentType) {
            throw new Error('Component Type이 잘못되었습니다.');
        }

        if (this._state !== this._states.disposed) {
            for (const component of this.components) {
                if (component.constructor.name === componentType.name) {
                    return component;
                }
            }
        }

        return null;
    }

    addTags(...tags) {
        if (this._state !== this._states.disposed) {
            this.tags = this.tags.concat(tags);
        }
    }

    removeTags(...tags) {
        this.tags = this.tags.filter(tag => !tags.includes(tag));
    }

    hasTag(tag) {
        return this.tags.includes(tag);
    }

    addGameObjects(...gameObjects) {
        if (this._state !== this._states.disposed) {
            this.gameObjects = this.gameObjects.concat(gameObjects);

            gameObjects.forEach(gameObject => {
                gameObject.bindParent(this);

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
                gameObject.unbindParent();
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

    init() {
        if (this._state === this._states.created) {
            if (this._enable) {
                this.onEnabled();
            }
            else {
                this.onDisabled();
            }

            this.onInitialize();

            this._state = this._states.initialized;

            this.components.forEach(component => {
                component.scene = this.scene;
                component.init();
            });

            this.gameObjects.forEach(gameObject => {
                gameObject.scene = this.scene;
                gameObject.init();
            });
        }
    }

    dispose() {
        if (this._state === this._states.initialized) {
            this._owner?.removeGameObjects(this);

            this.gameObjects.forEach(gameObject => {
                gameObject.dispose();
                gameObject.scene = null;
            });

            this.gameObjects = null;

            this.components.forEach(component => {
                component.dispose();
                component.scene = null;
            });

            this.components = null;

            this.onDisabled();
            this.onDispose();
            this.scene = null;

            this._state = this._states.disposed;
        }
    }

    event(events) {
        if (this._state === this._states.initialized && this._enable) {
            this.onEvent(events);

            this.components.forEach(component => {
                component.event(events);
            });

            this.gameObjects.forEach(gameObject => {
                gameObject.event(events);
            });
        }
    }

    update(timeDelta) {
        if (this._state === this._states.initialized && this._enable) {
            this.onUpdate(timeDelta);

            this.components.forEach(component => {
                component.update(timeDelta);
            });

            this.gameObjects.forEach(gameObject => {
                gameObject.update(timeDelta);
            });
        }
    }

    draw(context) {
        if (this._state === this._states.initialized && this._enable) {
            context.save();
            context.translate(~~this.area.x, ~~this.area.y); // for speed, ~~ === Math.floor

            this.onDraw(context);

            this.components.forEach(component => {
                component.draw(context);
            });

            this.gameObjects.forEach(object => {
                object.draw(context);
            });

            context.restore();
        }
    }

    localToGlobal(positionInLocal) {
        const positionInOwner = positionInLocal.add(this.area.getPosition().floor());
        
        return this.parent?.localToGlobal(positionInOwner) ?? positionInOwner;
    }

    globalToLocal(positionInGlobal) {
        const positionInOwner = this.parent?.globalToLocal(positionInGlobal) ?? positionInGlobal;

        return positionInOwner.subtract(this.area.getPosition().floor());
    }

    isDisposed() {
        return this._state === this._states.disposed;
    }

    _bindOwner(parent) {
        this.scene = parent.scene;
        this._owner = parent;
        this.onAdded();
    }

    _unbindOwner() {
        this.onRemoved();
        this.scene = null;
        this._owner = null;
    }
}