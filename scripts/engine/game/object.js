import { Area } from '../math/geometry/area.js';
import { Component } from './component.js';



export class GameObject {
    
    #initialized;
    #disposed;

    constructor(name='') {
        this.#initialized = false;
        this.#disposed = false;

        this.scene = null;

        this.owner = null;
        
        this.name = name;
        this.components = [];
        this.tags = [];

        this.objects = [];

        this.area = Area.zeros();
    }

    init() {
        if (!this.#initialized) {
            this.onInitialize();

            this.components.forEach(component => {
                component.onInitialize();
            });
    
            this.#initialized = true;
        }
    }

    dispose() {
        if (this.#initialized && !this.#disposed) {
            this.onDispose();

            this.components.forEach(component => {
                component.onDispose();
            });
    
            this.#disposed = true;
        }
    }

    addComponents(...components) {
        if (!this.#disposed) {
            this.components = this.components.concat(components);
            components.forEach(component => {
                component.owner = this;
                component.onAdded();

                if (this.#initialized) {
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

    containsComponent(componentName) {
        return this.components.some(component => component.name === componentName);
    }

    findComponents(componentName) {
        console.assert(componentName);
        
        return this.components.filter(component => component.name === componentName);
    }

    addTags(...tags) {
        if (!this.#disposed) {
            this.tags = this.tags.concat(tags);
        }
    }

    removeTags(...tags) {
        this.tags = this.tags.filter(tag => !tags.includes(tag));
    }

    containsTag(tag) {
        return this.tags.includes(tag);
    }

    addGameObjects(...objects) {
        if (!this.#disposed) {
            this.objects = this.objects.concat(objects);
            objects.forEach(obj => {
                obj.owner = this;
                obj.onAdded();

                if (this.#initialized) {
                    obj.onInitialize();
                }
            });
        }
    }

    removeGameObjects(...objects) {
        this.objects = this.objects.filter(obj => !objects.includes(obj));
        objects.forEach(obj => {
            obj.owner = null;
            obj.onRemoved();
        });
    }

    findGameObjects(gameObjectName) {
        return this.objects.filter(obj => obj.name === gameObjectName);
    }

    remove() {
        this.owner?.removeGameObject(this);

        this.dispose();
    }

    update(timeDelta) {
        if (this.#initialized && !this.#disposed) {
            this.onUpdate(timeDelta);

            this.components.forEach(component => {
                component.onUpdate(timeDelta);
            });

            this.objects.forEach(obj => obj.update(timeDelta));
        }
    }

    draw(context) {
        if (this.#initialized && !this.#disposed) {
            context.save();

            context.translate(...this.area.getPosition().toList());

            this.onDraw(context);

            this.components.forEach(component => {
                component.onDraw(context);
            });

            this.objects.forEach(obj => obj.draw(context));

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
        return this.#disposed;
    }

    onInitialize() {}
    onDispose() {}
    onAdded() {}
    onRemoved() {}
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
    testContainsTag();
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

function testContainsTag() {
    const gameObject = new GameObject('Stone');

    const tags = ['object', 'ground', 'hi', 'hello', 'okay'];

    gameObject.addTags(...tags);

    console.assert(!gameObject.containsTag('hey'));
    console.assert(tags.every(tag => gameObject.containsTag(tag)));
    console.assert(gameObject.tags.length === 5);
}

function testComponents() {
    testAddComponents();
    testRemoveComponents();
    testContainsComponent();
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

function testContainsComponent() {
    const gameObject = new GameObject('Stone');

    const components = [
        new Component('Transform'),
        new Component('SpriteRenderer'),
        new Component('Inventory')
    ];

    gameObject.addComponents(...components);

    console.assert(components.every(component => gameObject.containsComponent(component.name)));
    console.assert(gameObject.components.length === 3);
}

testGameObject();