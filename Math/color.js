export class Color {
    constructor(r, g, b, alpha = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }
}

export const Black = new Color(0, 0, 0);
export const White = new Color(255, 255, 255);
export const Red = new Color(255, 0, 0);
export const Green = new Color(0, 255, 0);
export const Blue = new Color(0, 0, 255);