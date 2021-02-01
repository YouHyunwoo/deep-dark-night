export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    multiply(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    divide(value) {
        return new Vector2(this.x / value, this.y / value);
    }

    multiplyEach(vector) {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }

    divideEach(vector) {
        return new Vector2(this.x / vector.x, this.y / vector.y);
    }

    innerProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    outerProduct(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    getSquareMagnitude() {
        return this.innerProduct(this);
    }

    getMagnitude() {
        return Math.sqrt(this.getSquareMagnitude());
    }

    normalize() {
        const magnitude = this.getMagnitude();
        
        return magnitude === 0 ? this.copy() : this.divide(magnitude);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    reverse() {
        return new Vector2(this.y, this.x);
    }

    toList() {
        return [this.x, this.y];
    }

    static full(value) {
        return new Vector2(value, value);
    }

    static zeros() {
        return Vector2.full(0);
    }

    static ones() {
        return Vector2.full(1);
    }
}