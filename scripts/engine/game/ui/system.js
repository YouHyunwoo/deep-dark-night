import { Area } from '../../math/geometry/area.js';
import { UIObject } from './object.js';



export class UISystem extends UIObject {
    onInitialize() {
        const canvas = this.scene.game.engine.canvas;

        this.area = new Area(0, 0, canvas.width, canvas.height);
    }

    draw(context) {
        if (this._state === this._states.initialized && this._enable) {
            context.save();

            context.translate(...this.area.getPosition().toList());

            this.onDraw(context);

            this.components.forEach(component => {
                component.draw(context);
            });

            this.gameObjects.forEach(object => {
                object.draw(context);
            });

            context.restore();
        }
    }
}