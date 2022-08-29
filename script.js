import { Buffer } from "./render.js"
import { Vector2, Vector3, cross, subVec3, dot, addVec3 } from "./Math/vector.js"
import { Camera } from "./Objects/camera.js"
import { Cube, Obj } from "./Objects/mesh.js"
import { Color, Black, White, Red, Green, Blue } from "./Util/color.js"
import { mat4x4VecMult, mat4x4Mult, worldMatrix, projectionMatrix, screenMatrix, FPSview, pDivide } from "./Math/matrix.js"
import { nearLineClip, LineClip2d, nearTriClip } from "./clipping.js"

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

const near = 0.1;
const far = 1000;
const fov = 60;
const aspect_ratio = canvas.height / canvas.width;

function rng() {
    return Math.floor(Math.random() * 255);
}

let colors = [
    new Color(rng(), rng(), rng()),
    new Color(rng(), rng(), rng()),
    new Color(rng(), rng(), rng()),
    new Color(rng(), rng(), rng()),
    new Color(rng(), rng(), rng()),
    new Color(rng(), rng(), rng()),
];



let projection_matrix = projectionMatrix(near, far, fov, aspect_ratio);

function loop() {
    window.requestAnimationFrame(loop);

    xRot = (mouse.x / canvas.width - 0.5) * 16;
    zRot = (mouse.y / canvas.height - 0.5) * 2;
    text.innerText = camera.pos.x + "\n" + camera.pos.y + "\n" + camera.pos.z;

    move();

    buffer.clear(canvas.width, canvas.height, c);
    buffer.clearDepthBuffer();

    let world_matrix = worldMatrix(cube);
    let view_matrix = FPSview(camera.pos, zRot, xRot);
    let fMatrix = mat4x4Mult(mat4x4Mult(world_matrix, view_matrix), projection_matrix);

    for (let i in cube.faces) {
        let v = [
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v1]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v2]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v3]),
        ];

        let verts = [];

        if (!nearTriClip(v[0], v[1], v[2], verts)) return;

        for (let k in verts) {
            pDivide(verts[k]);
            //verts[k] = mat4x4VecMult(screenMatrix(canvas.width, canvas.height), verts[k]);
            verts[k].x = verts[k].x * canvas.width / 2 + canvas.width / 2;
            verts[k].y = verts[k].y * -canvas.height / 2 + canvas.height / 2;
        }

        if (verts.length == 3) buffer.fillTriangle(verts[0], verts[1], verts[2], colors[i % 6]);
        else {
            buffer.fillTriangle(verts[0], verts[1], verts[2], colors[i % 6]);
            buffer.fillTriangle(verts[2], verts[3], verts[0], colors[i % 6]);
        }
    }

    buffer.draw(c);
}

window.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onkeydown = e => moveCamera(e);
window.onkeyup = e => moveCamera(e);

loop();