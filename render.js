import { Vector2, Vector3 } from "./Math/vector.js";
import { Cube, HexPrism, Mesh, Tri } from "./Objects/mesh.js";
import { Color } from "./Util/color.js";

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export class Buffer {
    #buffer;
    #zbuffer;
    #width;
    #height;

    constructor(context, width, height) {
        this.#width = width;
        this.#height = height;

        this.#buffer = context.createImageData(width, height);
        this.#zbuffer = new Array(width * height);
    }

    setPixel(x, y, z, color) {
        let i = (y * this.#width + x) * 4;

        if (x < 0 || y < 0 || x >= this.#width || y >= this.#height) {
            return;
        }

        if (z > this.#zbuffer[y * this.#width + x]) return;
        //console.log(z, this.#zbuffer[y * this.#width + x]);
        
        this.#zbuffer[y * this.#width + x] = z;

        this.#buffer.data[i + 0] = color.r;
        this.#buffer.data[i + 1] = color.g;
        this.#buffer.data[i + 2] = color.b;
        this.#buffer.data[i + 3] = color.alpha;
    }

    draw(context) {
        context.putImageData(this.#buffer, 0, 0);
    }
/*
    drawLine(v1, v2, color) {

        let x0 = Math.round(v1.x);
        let y0 = Math.round(v1.y);
        let x1 = Math.round(v2.x);
        let y1 = Math.round(v2.y);

        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);

        let sw = false;

        if (dx < dy) {
            [x0, y0] = [y0, x0];
            [x1, y1] = [y1, x1];
            [dx, dy] = [dy, dx];
            sw = true;
        }

        let error = 2 * dy - dx;

        for (let i = 0; i <= dx; i++) {
            (!sw) ? this.setPixel(x0, y0, color) : this.setPixel(y0, x0, color);
        
            (x0 < x1) ? x0++ : x0--;
            if (error < 0) {
                error += 2 * dy;
            } else {
                (y0 < y1) ? y0++ : y0--;
                error = error + 2 * dy - 2 * dx;
            }
        }
    }*/

    #drawHorLine(x0, x1, z0, z1, y, color) {
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [z0, z1] = [z1, z0];
        }

        let length = x1 - x0;

        if (x0 == x1) {
            this.setPixel(x0, y, z0, color);
            return;
        }

        for (let x = x0; x <= x1; x++) {
            this.setPixel(x, y, lerp(z0, z1, (x - x0) / length), color);
            //console.log((x - x0) / (x1 - x0));
        }
    }

    #bottomFlatTriangle(p1, p2, p3, color) {
        
        let invslope1 = (p2.x - p1.x) / (p2.y - p1.y);
        let invslope2 = (p3.x - p1.x) / (p3.y - p1.y);

        let z_invslope1 = (p2.z - p1.z) / (p2.y - p1.y);
        let z_invslope2 = (p3.z - p1.z) / (p3.y - p1.y);

        let curx1 = p1.x;
        let curx2 = p1.x;

        let curz1 = p1.z;
        let curz2 = p1.z;

        for (let scanlineY = p1.y; scanlineY <= p2.y; scanlineY++) {
            this.#drawHorLine(Math.round(curx1), Math.round(curx2), curz1, curz2, parseInt(scanlineY), color);

            curx1 += invslope1;
            curx2 += invslope2;
            curz1 += z_invslope1;
            curz2 += z_invslope2;
        }
    }

    #topFlatTriangle(p1, p2, p3, color) {
        let invslope1 = (p3.x - p1.x) / (p3.y - p1.y);
        let invslope2 = (p3.x - p2.x) / (p3.y - p2.y);

        let z_invslope1 = (p3.z - p1.z) / (p3.y - p1.y);
        let z_invslope2 = (p3.z - p2.z) / (p3.y - p2.y);

        let curx1 = p3.x;
        let curx2 = p3.x;
        let curz1 = p3.z;
        let curz2 = p3.z;

        for (let scanlineY = p3.y; scanlineY > p1.y; scanlineY--) {
            this.#drawHorLine(Math.round(curx1), Math.round(curx2), curz1, curz2, parseInt(scanlineY), color);

            curx1 -= invslope1;
            curx2 -= invslope2;
            curz1 -= z_invslope1;
            curz2 -= z_invslope2;
        }
    }

    fillTriangle(v1, v2, v3, color) {
        let p1 = new Vector3(Math.round(v1.x), Math.round(v1.y), v1.z);
        let p2 = new Vector3(Math.round(v2.x), Math.round(v2.y), v2.z);
        let p3 = new Vector3(Math.round(v3.x), Math.round(v3.y), v3.z);

        if (p1.y == p2.y && p2.y == p3.y) return;

        if (p2.y < p1.y) [p2, p1] = [p1, p2];
        if (p3.y < p2.y) [p3, p2] = [p2, p3];
        if (p2.y < p1.y) [p2, p1] = [p1, p2];

        if (p1.y == p2.y) {
            this.#topFlatTriangle(p1, p2, p3, color);
        } else if (p2.y == p3.y) {
            this.#bottomFlatTriangle(p1, p2, p3, color);
        } else {

            let p4 = new Vector3;
            p4.x = (p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x));
            p4.y = p2.y;
            p4.z = (p1.z == p3.z) ? p1.z : lerp(p1.z, p3.z, (p1.y - p4.y) / (p1.y - p3.y));

            //console.log(p1.z, p2.z, p4.z);
            this.#bottomFlatTriangle(p1, p2, p4, color);
            this.#topFlatTriangle(p2, p4, p3, color);
        }
    }

    clearDepthBuffer() {
        for (let i = 0; i < this.#zbuffer.length; i++) {
            this.#zbuffer[i] = Infinity;
        }
    }

    clear(width, height, context) {
        context.clearRect(0, 0, width, height);
        this.#buffer = context.getImageData(0, 0, width, height);
    }
}
