import { Area } from '../math/geometry/area.js';
import { Component } from './component.js';



export class GameObject {
    constructor(name='') {
        this.initialized = false;
        this.disposed = false;

        this.scene = null;

        this.owner = null;
        
        this.name = name;
        this.enable = true;
        this.components = [];
        this.tags = [];

        this.objects = [];

        this.area = Area.zeros();
    }

    init() {
        if (!this.initialized) {
            this.onInitialize();

            this.components.forEach(component => {
                component.onInitialize();
            });

            this.objects.forEach(object => {
                object.init();
            });
    
            this.initialized = true;
        }
    }

    dispose() {
        if (this.initialized && !this.disposed) {
            this.objects.forEach(object => {
                object.dispose();
            });

            this.onDispose();

            this.components.forEach(component => {
                component.onDispose();
            });

            this.scene = null;
    
            this.disposed = true;
        }
    }

    addComponents(...components) {
        if (!this.disposed) {
            this.components = this.components.concat(components);
            components.forEach(component => {
                component.owner = this;
                component.onAdded();

                if (this.initialized) {
                    component.onInitialize();
                }
            });
        }
    }

    removeComponents(...components) {
        this.components = this.components.filter(component => !components.includes(component));
        components.forEach(component => {
            component.owner = null;
            component.onRemoved();
        });
    }

    hasComponent(componentName) {
        return this.components.some(component => component.name === componentName);
    }

    findComponents(componentName) {
        console.assert(componentName);
        
        return this.components.filter(component => component.name === componentName);
    }

    findComponent(componentName) {
        console.assert(componentName);

        for (const component of this.components) {
            if (component.name === componentName) {
                return component;
            }
        }

        return null;
    }

    addTags(...tags) {
        if (!this.disposed) {
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
        if (!this.disposed) {
            this.objects = this.objects.concat(objects);
            objects.forEach(obj => {
                obj.scene = this.scene;
                obj.owner = this;
                obj.onAdded();

                if (this.initialized) {
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
        if (this.initialized && !this.disposed && this.enable) {
            this.onEvent(events);

            this.components.forEach(component => {
                component.onEvent(events);
            });

            this.objects.slice().reverse().forEach(object => {
                object.event(events);
            });
        }
    }

    update(timeDelta) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onUpdate(timeDelta);

            this.components.forEach(component => {
                component.onUpdate(timeDelta);
            });

            this.objects.forEach(object => {
                object.update(timeDelta);
            });
        }
    }

    draw(context) {
        if (this.initialized && !this.disposed && this.enable) {
            context.save();

            context.translate(...this.area.getPosition().toList());

            this.onDraw(context);

            this.components.forEach(component => {
                component.onDraw(context);
            });

            this.objects.forEach(object => {
                object.draw(context);
            });

            context.restore();
        }
    }

    localToGlobal(positionInLocal) {
        const positionInOwner = positionInLocal.add(this.area.getPosition());
        
        return this.owner?.localToGlobal(positionInOwner) ?? positionInOwner;
    }

    globalToLocal(positionInGlobal) {
        const positionInOwner = this.owner?.globalToLocal(positionInGlobal) ?? positionInGlobal;

        return positionInOwner.subtract(this.area.getPosition());
    }

    isDisposed() {
        return this.disposed;
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
    onEvent(events) {}
    onUpdate(timeDelta) {}
    onDraw(context) {}
}

function testGameObject() {
    testCreateGameObject();
    testTags();
    testComponents();
}

function testCreateGameObject() {
    testCreateEmptyGameObject();
}

function testCreateEmptyGameObject() {
    const gameObject = new GameObject('name');

    console.assert(gameObject.name === 'name');
    console.assert(gameObject.components.length === 0);
    console.assert(gameObject.tags.length === 0);
}

function testTags() {
    testAddTags();
    testRemoveTags();
    testhasTag();
}

function testAddTags() {
    const gameObject = new GameObject('Stone');

    gameObject.addTags('object', 'ground');
    gameObject.addTags('hi', 'hello', 'okay');

    console.assert(gameObject.tags.length === 5);
}

function testRemoveTags() {
    const gameObject = new GameObject('Stone');

    gameObject.addTags('object', 'ground');
    gameObject.addTags('hi', 'hello', 'okay');

    gameObject.removeTags('hi');
    gameObject.removeTags('hello', 'okay');

    console.assert(gameObject.tags.length === 2);
}

function testhasTag() {
    const gameObject = new GameObject('Stone');

    const tags = ['object', 'ground', 'hi', 'hello', 'okay'];

    gameObject.addTags(...tags);

    console.assert(!gameObject.hasTag('hey'));
    console.assert(tags.every(tag => gameObject.hasTag(tag)));
    console.assert(gameObject.tags.length === 5);
}

function testComponents() {
    testAddComponents();
    testRemoveComponents();
    testhasComponent();
}

function testAddComponents() {
    const gameObject = new GameObject('Stone');

    const components = [
        new Component('Transform'),
        new Component('SpriteRenderer'),
        new Component('Inventory')
    ];

    gameObject.addComponents(...components);

    console.assert(gameObject.components.length === 3);
}

function testRemoveComponents() {
    const gameObject = new GameObject('Stone');

    const components = [
        new Component('Transform'),
        new Component('SpriteRenderer'),
        new Component('Inventory')
    ];

    gameObject.addComponents(...components);

    gameObject.removeComponents(components[0], components[1]);

    console.assert(gameObject.components.length === 1);
    console.assert(gameObject.components[0] === components[2]);
}

function testhasComponent() {
    const gameObject = new GameObject('Stone');

    const components = [
        new Component('Transform'),
        new Component('SpriteRenderer'),
        new Component('Inventory')
    ];

    gameObject.addComponents(...components);

    console.assert(components.every(component => gameObject.hasComponent(component.name)));
    console.assert(gameObject.components.length === 3);
}

testGameObject();