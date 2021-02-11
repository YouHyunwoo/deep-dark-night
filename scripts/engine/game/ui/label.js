import { UIObject } from './object.js';
import { Vector2 } from '../../math/geometry/vector.js';



export class UILabel extends UIObject {

    // _text;
    // _font;
    // _fitContentHorizontal;
    // _fitContentVertical;

    constructor(name='Label') {
        super(name);

        this._text = null;
        this._font = '12px 굴림체';
        this._fitContentHorizontal = false;
        this._fitContentVertical = false;

        Object.defineProperties(this, {
            text: {
                get() {
                    return this._text;
                },
                set(value) {
                    this._text = value ?? '';

                    this._refreshSize();
                }
            },
            font: {
                get() {
                    return this._font;
                },
                set(value) {
                    this._font = value ?? '';

                    this._refreshSize();
                }
            },
            fitContentHorizontal: {
                get() {
                    return this._fitContentHorizontal;
                },
                set(value) {
                    this._fitContentHorizontal = value ?? false;

                    this._refreshSize();
                }
            },
            fitContentVertical: {
                get() {
                    return this._fitContentVertical;
                },
                set(value) {
                    this._fitContentVertical = value ?? false;

                    this._refreshSize();
                }
            },
            fitContent: {
                set(value) {
                    this._fitContentHorizontal = value.horizontal;
                    this._fitContentVertical = value.vertical;

                    this._refreshSize();
                }
            }
        });

        this.backgroundColor = 'grey';
        this.borderColor = null;
        this.color = 'black';

        this.textAlign = 'left';
        this.textBaseline = 'top';
    }

    _refreshSize() {
        if (this.context) {
            const context = this.context;

            context.save();
    
            context.font = this.font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            
            this._getContentSize(context);
    
            context.restore();
        }
    }

    onInitialize() {
        const scene = this.scene;
        const engine = scene.game.engine;
        const context = engine.context;

        this.context = context;

        this._refreshSize(context);
    }

    onDraw(context) {
        if (this.area.width >= 0 && this.area.height >= 0) {
            this._setFont(context);
            
            this._beginClipping(context);

            this._drawBackground(context);
            this._drawText(context);
            this._drawBorder(context);

            this._endClipping(context);
        }
    }

    _setFont(context) {
        console.assert(this.font);

        context.font = this.font;
    }

    _getContentSize(context) {
        const sizeContent = this.area.getSize();

        if (this._fitContentHorizontal || this._fitContentVertical) {
            const measured = context.measureText(this.text ?? '');

            if (this._fitContentHorizontal) {
                sizeContent.x = measured.width;
            }

            if (this._fitContentVertical) {
                sizeContent.y = measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent;
            }
        }

        this.area.resizeTo(sizeContent);
    }

    _beginClipping(context) {
        context.save();

        context.beginPath();
        context.rect(0, 0, ...this.area.getSize().toList());
        context.clip();
    }

    _drawBackground(context) {
        if (this.backgroundColor) {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, ...this.area.getSize().toList());
        }
    }

    _drawText(context) {
        if (this.text) {
            const positionText = this._getTextPosition(this.area.getSize());

            context.font = this.font;
            context.textAlign = this.textAlign;
            context.textBaseline = this.textBaseline;
            context.fillStyle = this.color;
            context.fillText(this.text, ...positionText.toList());
        }
    }

    _getTextPosition(sizeContent) {
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

    _drawBorder(context) {
        if (this.borderColor) {
            context.strokeStyle = this.borderColor;
            context.strokeRect(0, 0, ...this.area.getSize().toList());
        }
    }

    _endClipping(context) {
        context.restore();
    }
}