import { GameObject } from '../object.js';
import { Area } from '../../math/geometry/area.js';



export class UIObject extends GameObject {
    constructor(name) {
        super(name);

        this._stateMouse = null;
        this._mouseDown = null;

        this.engine = null;

        this.visible = true;
    }

    init() {
        if (!this.initialized) {
            const scene = this.scene;
            const game = scene.game;
            const engine = game.engine;
            
            this.engine = engine;
            
            this.onInitialize();

            this.components.forEach(component => {
                component.onInitialize();
            });

            this.objects.forEach(object => {
                object.scene = this.scene;
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
            this.engine = null;
    
            this.disposed = true;
        }
    }

    draw(context) {
        if (this.initialized && !this.disposed && this.enable && this.visible) {
            context.save();

            context.translate(...this.area.getPosition().toList());

            context.beginPath();
            context.rect(0, 0, ...this.area.getSize().toList());
            context.clip();

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

    event(events) {}

    mouseEvent(events) {
        if (!(this.initialized && !this.disposed && this.enable && this.visible)) {
            return [];
        }

        const usedEvents = [];

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

                    usedEvents.concat(usedEventsInChildren);
                });
            }
        }

        return usedEvents;
    }

    mouseIn(event) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onMouseIn(event);
        }
    }

    mouseMove(event) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onMouseMove(event);
        }
    }

    mouseOut(event) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onMouseOut(event);
        }
    }

    mouseDown(event) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onMouseDown(event);
        }
    }

    mouseUp(event) {
        if (this.initialized && !this.disposed && this.enable) {
            this.onMouseUp(event);
        }
    }

    onMouseIn(event) {}
    onMouseMove(event) {}
    onMouseOut(event) {}

    onMouseDown(event) {}
    onMouseUp(event) {}

    onClick(event) {}
}