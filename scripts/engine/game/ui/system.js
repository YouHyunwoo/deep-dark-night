import { GameObject } from '../object.js';
import { Area } from '../../math/geometry/area.js';



export class UISystem extends GameObject {

    #stateMouse;
    #mouseDown;

    constructor(name='UISystem') {
        super(name);

        this.#stateMouse = null;
        this.#mouseDown = null;

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

    mouseEvent(events) {
        let usedEvents = [];

        for (const event of events) {
            if (event.type === 'mousedown') {
                if (!this.#stateMouse) {
                    const positionMouse = event.position;

                    if (this.area.containsVector(positionMouse)) {
                        this.#mouseDown = true;

                        this.mouseIn(event);
                        this.mouseDown(event);

                        usedEvents.push(event);
                    }
                }
                else if (this.#stateMouse === 'mousemove') {
                    this.#mouseDown = true;

                    this.mouseDown(event);

                    usedEvents.push(event);
                }
            }
            else if (event.type === 'mousemove') {
                const positionMouse = this.globalToLocal(event.position);

                if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                    if (this.#stateMouse === 'mouseout' || !this.#stateMouse) {
                        this.#stateMouse = 'mousemove';

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
                    if (this.#stateMouse === 'mousemove' || !this.#stateMouse) {
                        this.#stateMouse = 'mouseout';

                        this.mouseOut(event);

                        usedEvents.push(event);
                    }
                }
            }
            else if (event.type === 'mouseup') {
                if (!this.#stateMouse) {
                    const positionMouse = event.position;

                    if (Area.zeroPosition(this.area).containsVector(positionMouse)) {
                        this.mouseIn(event);
                        this.mouseUp(event);

                        usedEvents.push(event);
                    }
                }
                else if (this.#stateMouse === 'mousemove') {
                    this.mouseUp(event);

                    if (this.#mouseDown) {
                        this.onClick(event);
                    }

                    usedEvents.push(event);
                }

                this.#mouseDown = false;
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