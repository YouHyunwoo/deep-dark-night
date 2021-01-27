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
        const originalSize = this.#spriteSheet.getImageSize();

        const cropPosition = this.cropInOriginalImage.slice(0, 2);
        const cropSize = this.cropInOriginalImage.slice(2, 4);

        const sx = originalSize[0] * cropPosition[0];
        const sy = originalSize[1] * cropPosition[1];
        const sw = originalSize[0] * cropSize[0];
        const sh = originalSize[1] * cropSize[1];

        const scaledWidth = sw * this.scale[0];
        const scaledHeight = sh * this.scale[1];
        const dx = -scaledWidth * this.anchor[0];
        const dy = -scaledHeight * this.anchor[1];

        context.drawImage(this.#spriteSheet.image, sx, sy, sw, sh, x + dx, y + dy, scaledWidth, scaledHeight);
    }
}

// export class SpriteAnimation {
//     constructor() {

//     }
// }