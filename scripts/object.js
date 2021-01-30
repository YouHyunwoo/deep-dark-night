export class GameObject {
    
    #initialized;
    #disposed;

    constructor(name='') {
        this.map = null;

        this.#initialized = false;
        this.#disposed = false;

        this.name = name;
        this.components = [];
        this.tags = [];

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.sprite = null;
    }

    init() {
        if (!this.#initialized) {
            this.components.forEach(component => {
                component.onInitialize();
            });
    
            this.#initialized = true;
        }
    }

    dispose() {
        if (this.#initialized && !this.#disposed) {
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

    remove() {
        this.map?.removeGameObject(this);
    }

    update(timeDelta) {
        if (this.#initialized && !this.#disposed) {
            
        }
    }

    draw(context) {
        if (this.#initialized && !this.#disposed) {
            if (this.#isDrawableSprite()) {
                this.#drawSprite(context);
            }
            else {
                this.#drawBlackRectangle(context);
            }
        }
    }

    #isDrawableSprite() {
        return this.sprite?.isDrawable();
    }

    #drawSprite(context) {
        this.sprite?.draw(context, this.x, this.y);
    }

    #drawBlackRectangle(context) {
        context.save();

        context.fillStyle = 'black';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        context.restore();
    }

    getSpriteArea() {
        return this.sprite?.getSpriteArea(this.x, this.y);
    }
}

export class Component {
    constructor(name='') {
        this.owner = null;

        this.name = name;
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