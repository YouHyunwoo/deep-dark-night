import { Area } from '../math/geometry/area.js';
import { Event } from '../util/event.js';



export class GameObject {
    constructor(name='') {
        this._states = {
            created: 0,
            initialized: 1,
            disposed: 2,
        };
        this._state = 0;

        this.scene = null;

        this.owner = null;
        
        this.name = name;
        this.enable = true;
        this.components = [];
        this.objects = [];
        this.tags = [];

        this.events = new Event();

        this.area = Area.zeros();
    }

    init() {
        if (this._state === this._states.created) {
            this.onInitialize();

            this.components.forEach(component => {
                component.init();
            });

            this.objects.forEach(object => {
                object.scene = this.scene;
                object.init();
            });

            this._state = this._states.initialized;
        }
    }

    dispose() {
        if (this._state === this._states.initialized) {
            this.objects.forEach(object => {
                object.dispose();
                object.scene = null;
            });

            this.onDispose();

            this.components.forEach(component => {
                component.dispose();
            });

            this.scene = null;

            this._state = this._states.disposed;
        }
    }

    addComponents(...components) {
        if (this._state !== this._states.disposed) {
            for (const component of components) {
                const componentType = component.constructor;

                if (this.hasComponent(componentType)) {
                    continue;
                }

                this.components.push(component);

                component.gameObject = this;
                component.onAdded();

                if (this.initialized) {
                    component.onInitialize();
                }
            }
        }
    }

    removeComponents(...components) {
        this.components = this.components.filter(component => !components.includes(component));

        components.forEach(component => {
            component.gameObject = null;
            component.onRemoved();
        });
    }

    hasComponent(componentType) {
        return this.components.some(component => component.constructor.name === componentType.name);
    }

    findComponent(componentType) {
        console.assert(componentType);

        for (const component of this.components) {
            if (component.constructor.name === componentType.name) {
                return component;
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

    addGameObjects(...objects) {
        if (this._state !== this._states.disposed) {
            this.objects = this.objects.concat(objects);
            objects.forEach(obj => {
                obj.scene = this.scene;
                obj.owner = this;
                obj.onAdded();

                if (this._state === this._states.initialized) {
                    obj.init();
                }
            });
        }
    }

    removeGameObjects(...objects) {
        this.objects = this.objects.filter(obj => !objects.includes(obj));
        objects.forEach(obj => {
            obj.scene = null;
            obj.owner = null;
            obj.onRemoved();
        });
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

    remove() {
        this.owner?.removeGameObjects(this);

        this.dispose();
    }

    event(events) {
        if (this._state === this._states.initialized && this.enable) {
            this.onEvent(events);

            this.components.forEach(component => {
                component.event(events);
            });

            this.objects.slice().reverse().forEach(object => {
                object.event(events);
            });
        }
    }

    update(timeDelta) {
        if (this._state === this._states.initialized && this.enable) {
            this.onUpdate(timeDelta);

            this.components.forEach(component => {
                component.update(timeDelta);
            });

            this.objects.forEach(object => {
                object.update(timeDelta);
            });
        }
    }

    draw(context) {
        if (this._state === this._states.initialized && this.enable) {
            context.save();

            const position = this.area.getPosition();
            
            position.x = Math.floor(position.x);
            position.y = Math.floor(position.y);

            context.translate(...position.toList());

            this.onDraw(context);

            this.components.forEach(component => {
                component.draw(context);
            });

            this.objects.forEach(object => {
                object.draw(context);
            });

            context.restore();
        }
    }

    localToGlobal(positionInLocal) {
        const positionInOwner = positionInLocal.add(this.area.getPosition().floor());
        
        return this.owner?.localToGlobal(positionInOwner) ?? positionInOwner;
    }

    globalToLocal(positionInGlobal) {
        const positionInOwner = this.owner?.globalToLocal(positionInGlobal) ?? positionInGlobal;

        return positionInOwner.subtract(this.area.getPosition().floor());
    }

    isDisposed() {
        return this._state === this._states.disposed;
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}