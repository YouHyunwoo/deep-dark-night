import { GameObject } from '../object.js';
import { Area } from '../../math/geometry/area.js';
import { UIObject } from './object.js';



export class UISystem extends UIObject {
    constructor(name) {
        super(name);
    }

    event(events) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onEvent(events);

            this.components.forEach(component => {
                component.onEvent(events);
            });

            const usedEvents = this.mouseEvent(events);

            usedEvents.forEach(event => {
                const index = events.indexOf(event);

                if (index >= 0) {
                    events.splice(index, 1);
                }
            });
        }
    }

    draw(context) {
        if (this.initialized && !this.disposed && this.enable) {
            context.save();

            context.translate(...this.area.getPosition().toList());

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

    mouseEvent(events) {
        let usedEvents = [];

        for (const event of events) {
            if (event.type === 'mousedown') {
                if (!this._stateMouse) {
                    const positionMouse = event.position;

                    if (this.area.containsVector(positionMouse)) {
                        this._mouseDown = true;

                        this.mouseIn(event);
                        this.mouseDown(event);

                        usedEvents.push(event);
                    }
                }
                else if (this._stateMouse === 'mousemove') {
                    this._mouseDown = true;

                    this.mouseDown(event);

                    usedEvents.push(event);
                }
            }
            else if (event.type === 'mousemove') {
                const positionMouse = this.globalToLocal(event.position);

                if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                    if (this._stateMouse === 'mouseout' || !this._stateMouse) {
                        this._stateMouse = 'mousemove';

                        this.mouseIn(event);
                        this.mouseMove(event);
                        
                        usedEvents.push(event);
                    }
                    else {
                        this.mouseMove(event);

                        usedEvents.push(event);
                    }
                }
                else {
                    if (this._stateMouse === 'mousemove' || !this._stateMouse) {
                        this._stateMouse = 'mouseout';

                        this.mouseOut(event);

                        usedEvents.push(event);
                    }
                }
            }
            else if (event.type === 'mouseup') {
                if (!this._stateMouse) {
                    const positionMouse = event.position;

                    if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                        this.mouseIn(event);
                        this.mouseUp(event);

                        usedEvents.push(event);
                    }
                }
                else if (this._stateMouse === 'mousemove') {
                    this.mouseUp(event);

                    if (this._mouseDown) {
                        this.onClick(event);
                    }

                    usedEvents.push(event);
                }

                this._mouseDown = false;
            }

            if (event.bubble) {
                this.objects.forEach(object => {
                    const usedEventsInChildren = object.mouseEvent(events) ?? [];
                    
                    usedEvents = usedEvents.concat(usedEventsInChildren);
                });
            }
        }

        return usedEvents;
    }

    // mouseIn(event) {
    //     if (this.initialized && !this.disposed && this.enable) {
    //         this.onMouseIn(event);
    //     }
    // }

    // mouseMove(event) {
    //     if (this.initialized && !this.disposed && this.enable) {
    //         this.onMouseMove(event);
    //     }
    // }

    // mouseOut(event) {
    //     if (this.initialized && !this.disposed && this.enable) {
    //         this.onMouseOut(event);
    //     }
    // }

    // mouseDown(event) {
    //     if (this.initialized && !this.disposed && this.enable) {
    //         this.onMouseDown(event);
    //     }
    // }

    // mouseUp(event) {
    //     if (this.initialized && !this.disposed && this.enable) {
    //         this.onMouseUp(event);
    //     }
    // }

    onMouseIn(event) {}
    onMouseMove(event) {}
    onMouseOut(event) {}

    onMouseDown(event) {}
    onMouseUp(event) {}

    onClick(event) {}
}