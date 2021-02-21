import { GameObject } from '../object.js';
import { Area } from '../../math/geometry/area.js';



export class UIObject extends GameObject {
    constructor(name) {
        super(name);

        this._mouseDown = null;
        this._mouseIn = null;

        this.visible = true;
    }

    draw(context) {
        if (this._state === this._states.initialized && this._enable && this.visible) {
            context.save();

            context.translate(...this.area.getPosition().toList());

            context.beginPath();
            context.rect(0, 0, ...this.area.getSize().toList());
            context.clip();

            this.onDraw(context);

            this.components.forEach(component => {
                component.onDraw(context);
            });

            this.gameObjects.forEach(object => {
                object.draw(context);
            });

            context.restore();
        }
    }

    event(events) {
        if (this._state === this._states.initialized && this._enable && this.visible) {
            this.onEvent(events);

            this.components.forEach(component => {
                component.event(events);
            });

            let captured = {
                mousemove: false,
                mouseup: false,
            };

            for (const event of events) {
                if (event.bubble) {
                    if (event.type === 'mousedown') {
                        const positionMouse = this.globalToLocal(event.position);

                        if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                            this._mouseDown = true;

                            event.capturing.push(this);
                        }
                    }
                    else if (event.type === 'mousemove') {
                        const positionMouse = this.globalToLocal(event.position);
    
                        if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                            captured.mousemove = true;
                            event.capturing.push(this);
                        }
                    }
                    else if (event.type === 'mouseup') {
                        const positionMouse = this.globalToLocal(event.position);
    
                        if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                            captured.mouseup = true;
                            event.capturing.push(this);
                        }
                    }
                }
            }
            
            const capturedEvents = events.filter(event => {
                return event.capturing[event.capturing.length-1] === this || event.type === 'mousemove' || event.type === 'mouseup';
            });
            
            this.gameObjects.forEach(gameObject => {
                gameObject.event(capturedEvents);
            });

            for (const event of capturedEvents) {
                if (event.bubble) {
                    event.target = this;

                    if (event.type === 'mousedown') {
                        if (!this._mouseIn) {
                            this._events.notify('mousein', event);
                            this._mouseIn = true;
                        }
                        
                        this._events.notify('mousedown', event);
                        this._mouseDown = true;
                    }
                    else if (event.type === 'mousemove') {
                        if (captured.mousemove) {
                            this._events.notify('mousemove', event);

                            if (!this._mouseIn) {
                                this._events.notify('mousein', event);
                                this._mouseIn = true;
                            }
                        }
                        else {
                            if (this._mouseIn) {
                                this._events.notify('mouseout', event);
                                this._mouseIn = false;
                            }
                        }
                    }
                    else if (event.type === 'mouseup') {
                        if (captured.mouseup) {
                            if (!this._mouseIn) {
                                this._events.notify('mousein', event);
                                this._mouseIn = true;
                            }
    
                            this._events.notify('mouseup', event);
    
                            if (this._mouseDown) {
                                this._events.notify('click', event);
                            }
                        }

                        this._mouseDown = false;
                    }
                }
            }

            const engine = this.scene.game.engine;

            engine.events = engine.events.filter(event => {
                return event.capturing.length === 0 || !event.capturing.includes(this);
            });
        }
    }
}