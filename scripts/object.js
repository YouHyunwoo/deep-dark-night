export class GameObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.image = null;
        this.imageLoaded = false;
        this.anchor = [0, 0];
    }

    draw(context) {
        context.save();

        if (this.imageLoaded) {
            context.drawImage(this.image, this.x - this.anchor[0], this.y - this.anchor[1]);
        }
        else {
            context.fillStyle = 'black';
            context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        context.restore();
    }
}

export class Stone extends GameObject {
    constructor() {
        super();

        this.image = new Image();
        this.image.onload = () => {
            console.log('hi');
            this.imageLoaded = true;
        };
        this.image.src = 'images/stone.png';
    }
}