import { UIObject } from './object.js';
import { Vector2 } from '../../math/geometry/vector.js';



export class UILabel extends UIObject {

    #text;
    #font;
    #fitContentHorizontal;
    #fitContentVertical;

    constructor(name='Label') {
        super(name);

        this.#text = null;
        this.#font = '12px 굴림체';
        this.#fitContentHorizontal = false;
        this.#fitContentVertical = false;

        Object.defineProperties(this, {
            text: {
                get() {
                    return this.#text;
                },
                set(value) {
                    this.#text = value ?? '';

                    this.#refreshSize();
                }
            },
            font: {
                get() {
                    return this.#font;
                },
                set(value) {
                    this.#font = value ?? '';

                    this.#refreshSize();
                }
            },
            fitContentHorizontal: {
                get() {
                    return this.#fitContentHorizontal;
                },
                set(value) {
                    this.#fitContentHorizontal = value ?? false;

                    this.#refreshSize();
                }
            },
            fitContentVertical: {
                get() {
                    return this.#fitContentVertical;
                },
                set(value) {
                    this.#fitContentVertical = value ?? false;

                    this.#refreshSize();
                }
            },
            fitContent: {
                set(value) {
                    this.#fitContentHorizontal = value.horizontal;
                    this.#fitContentVertical = value.vertical;

                    this.#refreshSize();
                }
            }
        });

        this.backgroundColor = 'grey';
        this.borderColor = null;
        this.color = 'black';

        this.textAlign = 'left';
        this.textBaseline = 'top';
    }

    #refreshSize() {
        if (this.context) {
            const context = this.context;

            context.save();
    
            context.font = this.font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            
            this.#getContentSize(context);
    
            context.restore();
        }
    }

    onInitialize() {
        const scene = this.scene;
        const engine = scene.game.engine;
        const context = engine.context;

        this.context = context;

        this.#refreshSize(context);
    }

    onDraw(context) {
        if (this.area.width >= 0 && this.area.height >= 0) {
            this.#setFont(context);
            
            this.#beginClipping(context);

            this.#drawBackground(context);
            this.#drawText(context);
            this.#drawBorder(context);

            this.#endClipping(context);
        }
    }

    #setFont(context) {
        console.assert(this.font);

        context.font = this.font;
    }

    #getContentSize(context) {
        const sizeContent = this.area.getSize();

        if (this.#fitContentHorizontal || this.#fitContentVertical) {
            const measured = context.measureText(this.text ?? '');

            if (this.#fitContentHorizontal) {
                sizeContent.x = measured.width;
            }

            if (this.#fitContentVertical) {
                sizeContent.y = measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent;
            }
        }

        this.area.resizeTo(sizeContent);
    }

    #beginClipping(context) {
        context.save();

        context.beginPath();
        context.rect(0, 0, ...this.area.getSize().toList());
        context.clip();
    }

    #drawBackground(context) {
        if (this.backgroundColor) {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, ...this.area.getSize().toList());
        }
    }

    #drawText(context) {
        if (this.text) {
            const positionText = this.#getTextPosition(this.area.getSize());

            context.font = this.font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            context.fillStyle = this.color;
            context.fillText(this.text, ...positionText.toList());
        }
    }

    #getTextPosition(sizeContent) {
        const horizontal = {
            left: 0,
            center: sizeContent.x / 2,
            right: sizeContent.x
        };

        const vertical = {
            top: 0,
            middle: sizeContent.y / 2,
            bottom: sizeContent.y
        }

        const positionHorizontal = horizontal[this.textAlign];
        const positionVertical = vertical[this.textBaseline];

        const position = new Vector2(positionHorizontal, positionVertical);

        return position;
    }

    #drawBorder(context) {
        if (this.borderColor) {
            context.strokeStyle = this.borderColor;
            context.strokeRect(0, 0, ...this.area.getSize().toList());
        }
    }

    #endClipping(context) {
        context.restore();
    }
}