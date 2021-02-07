import { UIObject } from '../../../../engine/game/ui/object.js';



export class Window extends UIObject {
    constructor(name='Window') {
        super(name);

        this.backgroundColor = null;
        this.borderColor = null;
    }

    onDraw(context) {
        if (this.area.width > 0 && this.area.height > 0) {
            context.save();

            if (this.backgroundColor) {
                context.fillStyle = this.backgroundColor;
                context.fillRect(0, 0, ...this.area.getSize().toList());
            }
    
            if (this.borderColor) {
                context.strokeStyle = this.borderColor;
                context.strokeRect(0, 0, ...this.area.getSize().toList());
            }
    
            context.restore();
        }
    }
}