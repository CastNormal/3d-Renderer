import { Buffer } from "./render.js"
import { cross, dot, subVec3, Vector2, Vector3 } from "./Math/vector.js"
import { Camera } from "./Objects/camera.js"
import { Cube, Obj } from "./Objects/mesh.js"
import { Color } from "./Util/color.js"
import { mat4x4VecMult, mat4x4Mult, worldMatrix, projectionMatrix, screenMatrix, FPSview, pDivide } from "./Math/matrix.js"
import { planeTriClip } from "./clipping.js"

let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

let text = document.getElementById("text");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

var left = false;
var right = false;
var forward = false;
var backward = false;
var up = false;
var down = false;

function moveCamera(event) {

    let state = (event.type == "keydown") ? true : false;

    switch (event.key) {
        case 'w':
            forward = state;
            break;
        case 's':
            backward = state;
            break;
        case 'a':
            left = state;
            break;
        case 'd':
            right = state;
            break;
        case 'ArrowUp':
            up = state;
            break;
        case 'ArrowDown':
            down = state;
            break;
    }
}

function move() {
    let mv = 0.5;

    if (forward) {
        camera.pos.z += mv;
    }

    if (backward) {
        camera.pos.z -= mv;
    }

    if (left) {
        camera.pos.x -= mv;
    }

    if (right) {
        camera.pos.x += mv;
    }

    if (up) {
        camera.pos.y += mv;
    }

    if (down) {
        camera.pos.y -= mv;
    }
}

var mouse = new Vector2(0, 0);


let buffer = new Buffer(c, canvas.width, canvas.height);


let camera = new Camera(new Vector3(0, 0, 0), new Vector3(0, 0, 0))
let cube = new Cube(new Vector3(0, 0, 5), new Vector3(0, 0, 0), 1);
//let cube = new Obj("monke.obj", new Vector3(0, 0, 5), new Vector3(0, 0, 0), 1);

let xRot = 0, zRot = 0;

const near = 0.001;
const far = 100000;
const fov = 60;
const aspect_ratio = canvas.height / canvas.width;

function rng() {
    return Math.floor(Math.random() * 255);
}

let uv1 = new Vector2(0, 0);
let uv2 = new Vector2(1, 0);
let uv3 = new Vector2(1, 1);

let projection_matrix = projectionMatrix(near, far, fov, aspect_ratio);

function loop() {
    window.requestAnimationFrame(loop);

    xRot = (mouse.x / canvas.width - 0.5) * 16;
    zRot = (mouse.y / canvas.height - 0.5) * 2;

    move();

    buffer.clear(canvas.width, canvas.height);
    buffer.clearDepthBuffer();

    let world_matrix = worldMatrix(cube);
    let view_matrix = FPSview(camera.pos, zRot, xRot);
    let fMatrix = mat4x4Mult(mat4x4Mult(world_matrix, view_matrix), projection_matrix);

    for (let i in cube.faces) {

        let v = [
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v1]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v2]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v3])
        ];

        let uv = [
            cube.faces[i].uv1,
            cube.faces[i].uv2,
            cube.faces[i].uv3
        ];

        let verts = [];

        if (!planeTriClip(v[0], v[1], v[2], verts, new Vector3(0, 0, 0.001))) return;

        for (let k in verts) {
            pDivide(verts[k]);
            //verts[k] = mat4x4VecMult(screenMatrix(canvas.width, canvas.height), verts[k]);
            verts[k].x = verts[k].x * canvas.width/2 + canvas.width/2;
            verts[k].y = verts[k].y * -canvas.height/2 + canvas.height/2;
        }

        let nv1 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v1]);
        let nv2 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v2]);
        let nv3 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v3]);

        let line1 = subVec3(nv2, nv1);
        let line2 = subVec3(nv3, nv1);

        let normal = cross(line1, line2);

        if (dot(normal, subVec3(nv1, camera.pos)) > 0) continue;

        if (verts.length == 3) {
            if ((i % 2) == 0) buffer.fillTriangle(verts[0], verts[1], verts[2], uv[0], uv[1], uv[2]);
            else buffer.fillTriangle(verts[0], verts[1], verts[2], uv[0], uv[1], uv[2]);
        }
        else {
            //buffer.fillTriangle(verts[0], verts[1], verts[2], uv1, uv2, uv3);
            //buffer.fillTriangle(verts[2], verts[3], verts[0], uv1, uv2, uv3);
        }
    }

    buffer.draw();
}

window.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onkeydown = e => moveCamera(e);
window.onkeyup = e => moveCamera(e);

loop();