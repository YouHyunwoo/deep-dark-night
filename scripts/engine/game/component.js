import { BaseObject } from './object.js';



export class Component extends BaseObject {
    constructor() {
        super();

        Object.defineProperty(this, 'gameObject', {
            get() {
                return this._owner;
            },
        });

        Object.defineProperty(this, 'bindGameObject', {
            get() {
                return this._bindOwner;
            },
        });

        Object.defineProperty(this, 'unbindGameObject', {
            get() {
                return this._unbindOwner;
            },
        });

        this.scene = null;
    }

    _bindOwner(owner) {
        this.scene = owner.scene;
        this._owner = owner;
        this.onAdded();
    }

    _unbindOwner() {
        this.onRemoved();
        this.scene = null;
        this._owner = null;
    }
}