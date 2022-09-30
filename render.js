import { Vector2, Vector3 } from "./Math/vector.js"
import { Cube, Mesh, Tri } from "./Objects/mesh.js"
import { Color } from "./Util/color.js"
import { Matrix } from "./Math/matrix.js"
import { leftTriClip, planeTriClip } from "./clipping.js";

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function clamp(a, min, max) {

    if (a < min) return min;
    else if (a > max) return max;
    else return a;
}

export class Buffer {
    #buffer;
    #zbuffer;
    #context;
    #texture;
    #width;
    #height;

    constructor(context, width, height) {
        this.#width = width;
        this.#height = height;

        this.#context = context;
        this.#buffer = context.createImageData(width, height);
        this.#zbuffer = new Array(width * height);

        const B = new Color(0, 0, 255);
        const R = new Color(255, 0, 0);
        const Y = new Color(255, 255, 0);

        this.#texture = [
            [Y, R, Y, R, B, R, B, R],
            [R, Y, R, Y, R, B, R, B],
            [Y, R, Y, R, B, R, B, R],
            [R, Y, R, Y, R, B, R, B],
            [Y, R, Y, R, B, R, B, R],
            [R, Y, R, Y, R, B, R, B],
            [Y, R, Y, R, B, R, B, R],
            [R, Y, R, Y, R, B, R, B]
        ];
    }

    setPixel(x, y, z, color) {
        let i = (y * this.#width + x) * 4;

        if (x < 0 || y < 0 || x >= this.#width || y >= this.#height) {
            //throw new Error("out");
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

    draw() {
        this.#context.putImageData(this.#buffer, 0, 0);
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

    #drawHorLine(x0, x1, z0, z1, y, u0, u1, v0, v1) {

        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [z0, z1] = [z1, z0];
            [u0, u1] = [u1, u0];
            [v0, v1] = [v1, v0];
        }

        let length = x1 - x0;

        if (x0 == x1) {

            let tex_x = Math.floor(u0 * 8 / z0);
            let tex_y = Math.floor(v0 * 8 / z0);

            tex_x = clamp(tex_x, 0, 7);
            tex_y = clamp(tex_y, 0, 7);

            this.setPixel(x0, y, 1 / z0, this.#texture[tex_y][tex_x]);
            return;
        }

        let x_step = 1 / Math.abs(length);
        let xt = 0;

        if (!(z0 <= 1 && z0 >= 0 && z1 <= 1 && z1 >= 0)) return;

        for (let x = x0; x <= x1; x++) {

            let z = lerp(z0, z1, xt);
            let lx = lerp(u0, u1, xt);
            let ly = lerp(v0, v1, xt);

            let tex_x = Math.floor(lx * 8 / z);
            let tex_y = Math.floor(ly * 8 / z);

            tex_x = clamp(tex_x, 0, 7);
            tex_y = clamp(tex_y, 0, 7);

            let color = this.#texture[tex_y][tex_x];
            this.setPixel(x, y, 1 / z, color);

            xt += x_step;
        }
    }

    #bottomFlatTriangle(p1, p2, p3, uv1, uv2, uv3) {

        let invslope1 = (p2.x - p1.x) / (p2.y - p1.y);
        let invslope2 = (p3.x - p1.x) / (p3.y - p1.y);

        let z_invslope1 = (p2.z - p1.z) / (p2.y - p1.y);
        let z_invslope2 = (p3.z - p1.z) / (p3.y - p1.y);

        let curx1 = p1.x;
        let curx2 = p1.x;

        let curz1 = p1.z;
        let curz2 = p1.z;

        let t_step = 1 / Math.abs(p2.y - p1.y);
        let t = 0;

        for (let scanlineY = p1.y; scanlineY <= p2.y; scanlineY++) {

            let u1 = lerp(uv1.x, uv2.x, t);
            let u2 = lerp(uv1.x, uv3.x, t);
            let v1 = lerp(uv1.y, uv2.y, t);
            let v2 = lerp(uv1.y, uv3.y, t);

            this.#drawHorLine(Math.round(curx1), Math.round(curx2), curz1, curz2, parseInt(scanlineY), u1, u2, v1, v2);

            curx1 += invslope1;
            curx2 += invslope2;
            curz1 += z_invslope1;
            curz2 += z_invslope2;

            t += t_step;
        }
    }

    #topFlatTriangle(p1, p2, p3, uv1, uv2, uv3) {
        let invslope1 = (p3.x - p1.x) / (p3.y - p1.y);
        let invslope2 = (p3.x - p2.x) / (p3.y - p2.y);

        let z_invslope1 = (p3.z - p1.z) / (p3.y - p1.y);
        let z_invslope2 = (p3.z - p2.z) / (p3.y - p2.y);

        let curx1 = p3.x;
        let curx2 = p3.x;
        let curz1 = p3.z;
        let curz2 = p3.z;

        let t_step = 1 / Math.abs(p3.y - p1.y);
        let t = 0;

        for (let scanlineY = p3.y; scanlineY > p1.y; scanlineY--) {

            let u1 = lerp(uv3.x, uv1.x, t);
            let u2 = lerp(uv3.x, uv2.x, t);
            let v1 = lerp(uv3.y, uv1.y, t);
            let v2 = lerp(uv3.y, uv2.y, t);

            this.#drawHorLine(Math.round(curx1), Math.round(curx2), curz1, curz2, parseInt(scanlineY), u1, u2, v1, v2);

            curx1 -= invslope1;
            curx2 -= invslope2;
            curz1 -= z_invslope1;
            curz2 -= z_invslope2;

            t += t_step;
        }
    }

    fillTriangle(v1, v2, v3, uv1, uv2, uv3) {        
        let p1 = new Vector3(Math.round(v1.x), Math.round(v1.y), v1.w);
        let p2 = new Vector3(Math.round(v2.x), Math.round(v2.y), v2.w);
        let p3 = new Vector3(Math.round(v3.x), Math.round(v3.y), v3.w);
        
        let te1 = new Vector2(uv1.x, uv1.y);
        let te2 = new Vector2(uv2.x, uv2.y);
        let te3 = new Vector2(uv3.x, uv3.y);

        te1.x = te1.x / p1.z;
        te2.x = te2.x / p2.z;
        te3.x = te3.x / p3.z;

        te1.y = te1.y / p1.z;
        te2.y = te2.y / p2.z;
        te3.y = te3.y / p3.z;

        p1.z = 1 / p1.z;
        p2.z = 1 / p2.z;
        p3.z = 1 / p3.z;

        if (p1.y == p2.y && p2.y == p3.y) return;

        if (p2.y < p1.y) {
            [p2, p1] = [p1, p2];
            [te2, te1] = [te1, te2];
        }

        if (p3.y < p2.y) {
            [p3, p2] = [p2, p3];
            [te3, te2] = [te2, te3];
        }

        if (p2.y < p1.y) {
            [p2, p1] = [p1, p2];
            [te2, te1] = [te1, te2];
        }


        if (p1.y == p2.y) {
            this.#topFlatTriangle(p1, p2, p3, te1, te2, te3);
        } else if (p2.y == p3.y) {
            this.#bottomFlatTriangle(p1, p2, p3, te1, te2, te3);
        } else {

            let p4 = new Vector3;
            p4.x = (p1.x + ((p2.y - p1.y) / (p3.y - p1.y)) * (p3.x - p1.x));
            p4.y = p2.y;
            p4.z = (p1.z == p3.z) ? p1.z : lerp(p1.z, p3.z, (p1.y - p4.y) / (p1.y - p3.y));

            let te4 = new Vector2;
            te4.x = lerp(te1.x, te3.x, (p1.y - p4.y) / (p1.y - p3.y));
            te4.y = lerp(te1.y, te3.y, (p1.y - p4.y) / (p1.y - p3.y));

            this.#bottomFlatTriangle(p1, p2, p4, te1, te2, te4);
            this.#topFlatTriangle(p2, p4, p3, te2, te4, te3);
        }
    }

    clearDepthBuffer() {
        for (let i = 0; i < this.#zbuffer.length; i++) {
            this.#zbuffer[i] = Infinity;
        }
    }

    clear(width, height) {
        this.#context.clearRect(0, 0, width, height);
        this.#buffer = this.#context.getImageData(0, 0, width, height);
    }
}

export function fillMesh(buffer, mesh, camera, projection_matrix, as) {
    let world_matrix = Matrix.worldMatrix(mesh);
    let view_matrix = Matrix.FPSview(camera.pos, camera.rot.z, camera.rot.x);
    let to_proj = Matrix.MatMult(view_matrix, projection_matrix);

    for (let i in mesh.faces) {
        let v = [[
            Matrix.MatVecMult(world_matrix, mesh.vertices[mesh.faces[i].v1]),
            Matrix.MatVecMult(world_matrix, mesh.vertices[mesh.faces[i].v2]),
            Matrix.MatVecMult(world_matrix, mesh.vertices[mesh.faces[i].v3])
        ]];

        let uv = [[
            mesh.faces[i].uv1,
            mesh.faces[i].uv2,
            mesh.faces[i].uv3
        ]];

        let line1 = Vector3.sub(v[0][1], v[0][0]);
        let line2 = Vector3.sub(v[0][2], v[0][0]);

        let normal = Vector3.cross(line1, line2);

        if (Vector3.dot(normal, Vector3.sub(v[0][0], camera.pos)) > 0) continue;

        v[0][0] = Matrix.MatVecMult(to_proj, v[0][0]);
        v[0][1] = Matrix.MatVecMult(to_proj, v[0][1]);
        v[0][2] = Matrix.MatVecMult(to_proj, v[0][2]);

        let verts = [];

        leftTriClip(v, uv, new Vector3(0, 0, 1), new Vector3(0, 0, 1));

        for (let j of v) {
            let tri = [];

            for (let k = 0; k < 3; k++) {

                let vec = j[k];

                vec.x /= vec.w;
                vec.y /= vec.w;
                vec.z /= vec.w;

                vec.x = vec.x * (canvas.width/2) + (canvas.width/2);
                vec.y = vec.y * (-canvas.height/2) + (canvas.height/2);

                tri.push(vec);
            }

            verts.push(tri);
        }

        for (let t in verts) buffer.fillTriangle(verts[t][0], verts[t][1], verts[t][2], uv[t][0], uv[t][1], uv[t][2]);
    }
}