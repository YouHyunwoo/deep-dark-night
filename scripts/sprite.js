export class SpriteSheet { // 자료구조인지 객체인지 명확히 하기
    constructor(imageSource) {
        this.imageSize = [0, 0];
        this.imageLoaded = false;
        
        this.image = new Image();
        this.image.onload = () => {
            this.imageSize = [this.image.width, this.image.height];
            this.imageLoaded = true;
        }
        this.image.src = imageSource;
    }

    getImageSize() {
        return this.imageSize;
    }

    isLoaded() {
        return this.imageLoaded;
    }
}

export class Sprite {

    #spriteSheet;

    constructor(spriteSheet) {
        this.#spriteSheet = spriteSheet;
        
        this.cropInOriginalImage = [0, 0, 1, 1];
        this.anchor = [0, 0];
        this.scale = [1, 1];
    }

    draw(context, x, y) {
        if (this.isDrawable()) {
            this.#drawSprite(context, x, y);
        }
    }

    isDrawable() {
        return this.#spriteSheet?.isLoaded();
    }

    #drawSprite(context, x, y) {
        const [sx, sy, sw, sh] = this.#getSourceArea();
        const [dx, dy, dw, dh] = this.#getDestinationArea(sw, sh);

        context.drawImage(this.#spriteSheet.image, sx, sy, sw, sh, x + dx, y + dy, dw, dh);
    }
    
    #getSourceArea() {
        const [imageWidth, imageHeight] = this.#spriteSheet.getImageSize();

        const cropPosition = this.cropInOriginalImage.slice(0, 2);
        const cropSize = this.cropInOriginalImage.slice(2, 4);

        const sx = imageWidth * cropPosition[0];
        const sy = imageHeight * cropPosition[1];
        const sw = imageWidth * cropSize[0];
        const sh = imageHeight * cropSize[1];

        return [sx, sy, sw, sh];
    }

    #getDestinationArea(sourceWidth, sourceHeight) {
        const scaledWidth = sourceWidth * this.scale[0];
        const scaledHeight = sourceHeight * this.scale[1];
        const dx = -scaledWidth * this.anchor[0];
        const dy = -scaledHeight * this.anchor[1];

        return [dx, dy, scaledWidth, scaledHeight];
    }

    getSpriteArea(x, y) {
        const [sx, sy, sw, sh] = this.#getSourceArea();
        const [dx, dy, dw, dh] = this.#getDestinationArea(sw, sh);

        return [x + dx, y + dy, dw, dh];
    }
}

// export class SpriteAnimation {
//     constructor() {

//     }
// }