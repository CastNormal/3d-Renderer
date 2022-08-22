import { Buffer } from  "./render.js"
import { Vector2, Vector3, cross, subVec3, dot, addVec3 } from "./Math/vector.js"
import { Camera } from "./Objects/camera.js"
import { Cube } from "./Objects/mesh.js"
import { Color, Black, White, Red, Green, Blue } from "./Math/color.js"
import { mat4x4VecMult, mat4x4Mult, worldMatrix, projectionMatrix, screenMatrix, FPSview, pDivide } from "./Math/matrix.js"

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
let camera = new Camera(new Vector3(0, 0, 0), new Vector3(0, 0, 0));

let cube = new Cube(new Vector3(0, 0, 5), new Vector3(0, 0, 0), 1);

let xRot = 0, zRot = 0;

const near = 0.1;
const far = 1000;
const fov = 90;
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
]

let projection_matrix = projectionMatrix(near, far, fov, aspect_ratio);

function loop() {
    window.requestAnimationFrame(loop);

    xRot = (mouse.x / canvas.width - 0.5) * 8;
    zRot = (mouse.y / canvas.height - 0.5) * 2;
    //cube.rot.x += 0.01;
    //cube.rot.z += 0.01;

    move();

    //buffer.clear(canvas.width, canvas.height, c);
    c.clearRect(0, 0, canvas.width, canvas.height);

    let world_matrix = worldMatrix(cube);
    let view_matrix = FPSview(camera.pos, zRot, xRot);
    let fMatrix = mat4x4Mult(mat4x4Mult(world_matrix, view_matrix), projection_matrix);

    for (let i in cube.faces) {
        let v = [
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v1-1]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v2-1]),
            mat4x4VecMult(fMatrix, cube.vertices[cube.faces[i].v3-1]),
        ];

        if (v[0].z < -v[0].w || v[0].z > v[0].w || v[0].x < -v[0].w || v[0].x > v[0].w || v[0].y < -v[0].w || v[0].y > v[0].w) return;
        if (v[1].z < -v[1].w || v[1].z > v[1].w || v[1].x < -v[1].w || v[1].x > v[1].w || v[1].y < -v[1].w || v[1].y > v[1].w) return;
        if (v[2].z < -v[2].w || v[2].z > v[2].w || v[2].x < -v[2].w || v[2].x > v[2].w || v[2].y < -v[2].w || v[2].y > v[2].w) return;

        
        for (let j of v) {
            pDivide(j);
        }

        let screen = [
            mat4x4VecMult(screenMatrix(canvas.width, canvas.height), v[0]),
            mat4x4VecMult(screenMatrix(canvas.width, canvas.height), v[1]),
            mat4x4VecMult(screenMatrix(canvas.width, canvas.height), v[2])
        ];



        let nv1 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v1-1]);
        let nv2 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v2-1]);
        let nv3 = mat4x4VecMult(world_matrix, cube.vertices[cube.faces[i].v3-1]);

        let line1 = subVec3(nv2, nv1);
        let line2 = subVec3(nv3, nv1);

        let normal = cross(line1, line2);

        if (dot(normal, subVec3(nv1, camera.pos)) < 0) {
            //buffer.fillTriangle(v1, v2, v3, colors[i%6]);
            c.fillStyle = "rgb(" + colors[i%6].r + ", " + colors[i%6].g + ", " + colors[i%6].b + ")";
            c.beginPath();
            c.moveTo(screen[0].x, screen[0].y);
            c.lineTo(screen[1].x, screen[1].y);
            c.lineTo(screen[2].x, screen[2].y);
            c.fill();
        }

    }

    //text.innerText = camera.pos.x + "\n" + camera.pos.y + "\n" + camera.pos.z;

    //buffer.draw(c);
}

window.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onkeydown = e => moveCamera(e);
window.onkeyup= e => moveCamera(e);

loop();