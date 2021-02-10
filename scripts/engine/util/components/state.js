import { Component } from '../../game/component.js';



export class StateContext extends Component {
    constructor(name) {
        super(name);

        this.states = {};

        this.object = null;
        this.state = null;
    }

    onInitialize() {
        const object = this.owner;
        const gameObjects = object.objects;

        console.assert(gameObjects.length !== 0);

        gameObjects.forEach(gameObject => {
            const states = gameObject.findComponents('State');

            gameObject.init();

            if (states.length !== 0) {
                gameObject.enable = false;
                this.states[gameObject.name] = [gameObject, states[0]];
                states[0].context = this;
            }
        });

        if (!this.state) {
            [this.object, this.state] = Object.values(this.states)[0];
            this.object.enable = true;
        }

        this.state?.onEnter();
    }

    onDispose() {
        this.object.enable = false;
        this.state?.onExit();

        this.object = null;
        this.state = null;

        for (const gameObjectName in this.states) {
            const [gameObject, state] = this.states[gameObjectName];

            gameObject.dispose();
        }
    }

    transit(stateId, exitArgs, enterArgs) {
        this.state?.onExit(...(exitArgs ?? []));
        this.object.enable = false;

        [this.object, this.state] = this.states[stateId];

        this.object.enable = true;
        this.state?.onEnter(...(enterArgs ?? []));
    }
}

export class State extends Component {
    constructor(name) {
        super(name);

        this.context = null;
    }

    onInitialize() {
        const object = this.owner;
        const parent = object.owner;
        const context = parent.findComponent('StateContext');

        this.context = context;
    }

    onEnter() {}
    onExit() {}

    transit(stateId, exitArgs, enterArgs) {
        this.context.transit(stateId, exitArgs, enterArgs);
    }
}