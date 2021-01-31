import { Area } from "../math/geometry/area.js";
import { Vector2 } from "../math/geometry/vector.js";



export class SpriteSheet {
    
    #image;
    #imageSize;
    #imageLoaded;

    constructor(imageSource) {
        this.#imageSize = Vector2.zeros();
        this.#imageLoaded = false;
        
        this.#image = new Image();
        this.#image.onload = () => {
            this.#imageSize = new Vector2(this.#image.width, this.#image.height);
            this.#imageLoaded = true;
        }
        this.#image.src = imageSource;
    }

    draw(context, ...args) {
        context.drawImage(this.#image, ...args);
    }

    getImageSize() {
        return this.#imageSize;
    }

    isLoaded() {
        return this.#imageLoaded;
    }
}

export class Sprite {

    #spriteSheet;

    constructor(spriteSheet) {
        this.#spriteSheet = spriteSheet;
        
        this.cropInOriginalImage = new Area(0, 0, 1, 1);
        this.scale = Vector2.ones();
        this.anchor = Vector2.zeros();
    }

    draw(context, position) {
        if (this.isDrawable()) {
            this.#drawSprite(context, position);
        }
    }

    isDrawable() {
        return this.#spriteSheet?.isLoaded();
    }

    #drawSprite(context, position) {
        const sourceArea = this.#getSourceArea();
        const sourceSize = sourceArea.getSize();
        const destinationArea = this.#getDestinationArea(sourceSize);

        destinationArea.moveBy(position);
        
        this.#spriteSheet.draw(context, ...sourceArea.toList(), ...destinationArea.toList());
    }
    
    #getSourceArea() {
        const imageSize = this.#spriteSheet.getImageSize();

        const cropPosition = this.cropInOriginalImage.getPosition();
        const cropSize = this.cropInOriginalImage.getSize();

        const sourcePosition = imageSize.multiplyEach(cropPosition);
        const sourceSize = imageSize.multiplyEach(cropSize);

        return Area.combine(sourcePosition, sourceSize);
    }

    #getDestinationArea(sourceSize) {
        const scaledSize = sourceSize.multiplyEach(this.scale);
        const destinationPosition = scaledSize.multiplyEach(this.anchor).multiply(-1);

        return Area.combine(destinationPosition, scaledSize);
    }

    getSpriteArea(position) {
        const sourceArea = this.#getSourceArea();
        const sourceSize = sourceArea.getSize();
        const destinationArea = this.#getDestinationArea(sourceSize);

        destinationArea.moveBy(position);

        return destinationArea;
    }
}

export class SpriteAnimation {
    constructor(...frames) {
        this.frames = frames ?? [];
        this.speed = 1;

        this.timeElapsed = 0;
        this.currentFrameIndex = 0;
        this.timeCumulated = [0];

        frames.reduce((acc, cur) => {
            const timeElapsed = acc + cur.duration;

            this.timeCumulated.push(timeElapsed);

            return acc + cur.duration;
        }, 0);
    }

    addFrames(...frames) {
        frames.forEach(frame => {
            const lastIndex = this.timeCumulated.length - 1;
            const cumulated = this.timeCumulated[lastIndex] + frame.duration;

            this.timeCumulated.push(cumulated);
            this.frames.push(frame);
        });
    }

    update(timeDelta) {
        const frameCount = this.frames.length;

        this.timeElapsed = (this.timeElapsed + this.speed * timeDelta) % this.timeCumulated[frameCount];

        for (let i = 0; i < frameCount; i++) {
            const index = (this.currentFrameIndex + i) % frameCount;

            const lowerBound = this.timeCumulated[index];
            const upperBound = this.timeCumulated[index + 1];

            if (lowerBound <= this.timeElapsed && this.timeElapsed < upperBound) {
                this.currentFrameIndex = index % frameCount;
                break;
            }
        }
    }

    getSprite() {
        return this.frames[this.currentFrameIndex].sprite;
    }
}

export class SpriteAnimationFrame {
    constructor(sprite, duration) {
        this.sprite = sprite;
        this.duration = duration;
    }
}