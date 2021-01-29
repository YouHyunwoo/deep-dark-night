export class State {
    constructor(owner, id) {
        this.owner = owner;
        this.id = id;
    }

    request(messageId, ...messageContents) {}
}