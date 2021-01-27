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

        const scaledWidth = originalSize[0] * this.scale[0];
        const scaledHeight = originalSize[1] * this.scale[1];
        const dx = -scaledWidth * this.anchor[0];
        const dy = -scaledHeight * this.anchor[1];

        context.drawImage(this.#spriteSheet.image, x + dx, y + dy, scaledWidth, scaledHeight);
    }
}

// export class SpriteAnimation {
//     constructor() {

//     }
// }