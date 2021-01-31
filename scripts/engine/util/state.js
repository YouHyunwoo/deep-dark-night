export class StateContext {
    constructor(states) {
        this.states = {};
        this.state = null;

        states.forEach(state => {
            if (this.state === null) {
                this.state = state;
            }

            this.states[state.id] = state;
        });
    }

    transit(stateId, exitArgs, enterArgs) {
        console.assert(stateId !== null);

        this.state.onExit(...(exitArgs ?? []));

        this.state = this.states[stateId];

        this.state.onEnter(...(enterArgs ?? []));
    }

    request(messageId, ...messageContents) {
        this.state?.request(messageId, ...messageContents);
    }
}

export class State {
    constructor(owner, id) {
        this.owner = owner;
        this.id = id;
    }

    onEnter(...exitArgs) {}
    onExit(...enterArgs) {}

    request(messageId, ...messageContents) {}
}