import { Component } from '../../game/component.js';



export class StateContext extends Component {
    constructor() {
        super();

        this.states = {};

        this.state = null;
    }

    onInitialize() {
        const object = this.gameObject;
        const components = object.components;

        components.forEach(component => {
            if (component instanceof State) {
                const state = component;

                state.enable = false;
                state.context = this;
                state.init();

                this.states[state.constructor.name] = state;
            }
        });

        if (!this.state) {
            this.state = Object.values(this.states)[0];
            this.state.enable = true;
            this.state.enter();
        }
    }

    onDispose() {
        this.state.exit();
        this.state.enable = false;

        this.state = null;

        Object.values(this.states).forEach(state => {
            state.enable = false;
            state.context = null;
            state.dispose();
        });

        this.states = null;
    }

    transit(stateType, exitArgs, enterArgs) {
        this.state?.exit(...(exitArgs ?? []));
        if (this.state) {
            this.state.enable = false;
        }

        this.state = this.states[stateType.name];

        if (this.state) {
            this.state.enable = true;
        }
        this.state?.enter(...(enterArgs ?? []));
    }
}

export class State extends Component {
    constructor() {
        super();

        this.context = null;
    }

    enter(...args) {
        if (this._state === this._states.initialized && this.enable) {
            this.onEnter(...args);
        }
    }

    exit(...args) {
        if (this._state === this._states.initialized && this.enable) {
            this.onExit(...args);
        }
    }

    onEnter() {}
    onExit() {}

    transit(stateType, exitArgs, enterArgs) {
        this.context.transit(stateType, exitArgs, enterArgs);
    }
}