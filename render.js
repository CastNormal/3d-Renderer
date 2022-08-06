import { Vector2, Vector3 } from "./Math/vector.js";
import { Cube, HexPrism, Mesh, Tri } from "./Objects/mesh.js";
import { Color } from "./Math/color.js";

export class Buffer {
    #buffer;
    #width;
    #height;

    constructor(context, width, height) {
        this.#width = width;
        this.#height = height;

        this.#buffer = context.createImageData(width, height);
    }

    setPixel(x, y, color) {
        let i = (y * this.#width + x) * 4;

        if (x < 0 || y < 0 || x > this.#width || y > this.#height) {
            return;
        }

        this.#buffer.data[i + 0] = color.r;
        this.#buffer.data[i + 1] = color.g;
        this.#buffer.data[i + 2] = color.b;
        this.#buffer.data[i + 3] = color.alpha;
    }

    draw(context) {
        context.putImageData(this.#buffer, 0, 0);
    }

    drawLine(x0, y0, x1, y1, color) {

        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);

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
    }

    #drawHorLine(x0, x1, y, color) {
        if (x0 > x1) [x0, x1] = [x1, x0];

        for (let x = x0; x < x1; x++) {
            this.setPixel(Math.round(x), Math.round(y), color);
        }   
    }

    #bottomFlatTriangle(p1, p2, p3, color) {
        
        

        let invslope1 = (p2.x - p1.x) / (p2.y - p1.y);
        let invslope2 = (p3.x - p1.x) / (p3.y - p1.y);

        let curx1 = p1.x;
        let curx2 = p1.x;

        for (let scanlineY = p1.y; scanlineY <= p2.y; scanlineY++) {
            this.#drawHorLine(curx1, curx2, scanlineY, color);

            curx1 += invslope1;
            curx2 += invslope2;
        }
    }

    #topFlatTriangle(p1, p2, p3, color) {
        let invslope1 = (p3.x - p1.x) / (p3.y - p1.y);
        let invslope2 = (p3.x - p2.x) / (p3.y - p2.y);

        let curx1 = p3.x;
        let curx2 = p3.x;

        for (let scanlineY = p3.y; scanlineY > p1.y; scanlineY--) {
            this.#drawHorLine(curx1, curx2, scanlineY, color);

            curx1 -= invslope1;
            curx2 -= invslope2;
        }
    }

    fillTriangle(v1, v2, v3, color) {

        let p1 = new Vector2(Math.round(v1.x), Math.round(v1.y));
        let p2 = new Vector2(Math.round(v2.x), Math.round(v2.y));
        let p3 = new Vector2(Math.round(v3.x), Math.round(v3.y));

        if (p1.y == p2.y && p2.y == p3.y) return;

        if (p2.y < p1.y) [p2, p1] = [p1, p2];
        if (p3.y < p2.y) [p3, p2] = [p2, p3];
        if (p2.y < p1.y) [p2, p1] = [p1, p2];

        if (p1.y == p2.y) {
            this.#topFlatTriangle(p1, p2, p3, color);
        } else if (p2.y == p3.y) {
            this.#bottomFlatTriangle(p1, p2, p3, color);
        } else {
            let p4 = new Vector2(Math.round((p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x))), Math.round(p2.y));
            this.#bottomFlatTriangle(p1, p2, p4, color);
            this.#topFlatTriangle(p2, p4, p3, color);

            //this.drawLine(p2.x, p2.y, p4.x, p4.y, new Color(255, 0, 0));
        }
    }

    clear(width, height, context) {
        context.clearRect(0, 0, width, height);
        this.#buffer = context.getImageData(0, 0, width, height);
    }

    drawTriangle(p1, p2, p3, color) {
        this.drawLine(p1.x, p1.y, p2.x, p2.y, color);
        this.drawLine(p1.x, p1.y, p3.x, p3.y, color);
        this.drawLine(p2.x, p2.y, p3.x, p3.y, color);
    }
}

export function getVertex(camera, point, fov, width, height) {

    let fovRad = 1/Math.tan((fov * 0.5) * (180 / Math.PI));

    let px = point.x - camera.pos.x;
    let py = point.y - camera.pos.y;
    let pz = point.z - camera.pos.z;

    let cx = Math.cos(camera.rot.x);
    let cy = Math.cos(camera.rot.y);
    let cz = Math.cos(camera.rot.z);

    let sx = Math.sin(camera.rot.x);
    let sy = Math.sin(camera.rot.y);
    let sz = Math.sin(camera.rot.z);

    let dx = cy * (sz*py + cz*px) - sy*pz;
    let dy = sx * (cy*pz + sy*(sz*py + cz*px)) + cx * (cz*py - sz*px);
    let dz = cx * (cy*pz + sy*(sz*py + cz*px)) - sx * (cz*py - sz*px);

    if (dz < 0) return;

    let bx = (((height / width) * fovRad) * dx) / dz;
    let by = (fovRad * dy) / dz;

    bx = bx * width/2 + width/2;
    by = by * height/2 + height/2;

    return new Vector2(bx, by);
}