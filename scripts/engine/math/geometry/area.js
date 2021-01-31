import { Vector2 } from "./vector.js";



export function containsArea(area, mouse) {
    const [x, y, w, h] = area;
    const [mx, my] = mouse;

    return x <= mx && mx < x + w && y <= my && my < y + h;
}

export class Area {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    containsVector(vector) {
        const horizontal = this.x <= vector.x && vector.x < this.x + this.width;
        const vertical = this.y <= vector.y && vector.y < this.y + this.height;

        return horizontal && vertical;
    }

    containsArea(area) {
        const horizontal = this.x <= area.x && area.x + area.width <= this.x + this.width;
        const vertical = this.y <= area.y && area.y + area.height <= this.y + this.height;

        return horizontal && vertical;
    }

    intersects(area) {
        const horizontal = this.x <= area.x + area.width && area.x <= this.x + this.width;
        const vertical = this.y <= area.y + area.height && area.y <= this.y + this.height;

        return horizontal && vertical;
    }

    moveTo(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    moveBy(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    resizeTo(vector) {
        this.width = vector.x;
        this.height = vector.y;
    }

    resizeBy(vector) {
        this.width += vector.x;
        this.height += vector.y;
    }

    scale(vector) {
        this.width *= vector.x;
        this.height *= vector.y;
    }

    toList() {
        return [this.x, this.y, this.width, this.height];
    }

    toString() {
        return `${this.toList()}`;
    }

    getPosition() {
        return new Vector2(this.x, this.y);
    }

    getSize() {
        return new Vector2(this.width, this.height);
    }

    copy() {
        return new Area(this.x, this.y, this.width, this.height);
    }

    static combine(position, size) {
        return new Area(position.x, position.y, size.x, size.y);
    }

    static zeros() {
        return new Area(0, 0, 0, 0);
    }
}