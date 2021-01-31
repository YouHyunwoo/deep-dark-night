export function containsArea(area, mouse) {
    const [x, y, w, h] = area;
    const [mx, my] = mouse;

    return x <= mx && mx < x + w && y <= my && my < y + h;
}