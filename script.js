import { Buffer, fillMesh } from "./render.js"
import { Vector2, Vector3 } from "./Math/vector.js"
import { Camera } from "./Objects/camera.js"
import { Cube, Obj } from "./Objects/mesh.js"
import { Color } from "./Util/color.js"
import { Matrix } from "./Math/matrix.js"

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
        case '1':
            camera.rot.x -= 0.05;
            break;
        case '2':
            camera.rot.x += 0.05;
            break;
        case '3':
            camera.rot.z -= 0.05;
            break;
        case '4':
            camera.rot.z += 0.05;
    }
}

function move() {
    let mv = 0.1;

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
let cube0 = new Cube(new Vector3(0, 0, 5), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
let cube1 = new Cube(new Vector3(2, 0, 5), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
let cube2 = new Cube(new Vector3(4, 0, 5), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
let cube3 = new Cube(new Vector3(6, 0, 5), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
//let cube = new Obj("monke.obj", new Vector3(0, 0, 5), new Vector3(0, 0, 0), 1);

const near = 0.001;
const far = 10;
const fov = 60;
const aspect_ratio = canvas.height / canvas.width;

let projection_matrix = Matrix.projectionMatrix(near, far, fov, aspect_ratio);
function loop() {
    window.requestAnimationFrame(loop);

    move();

    //buffer.clear(canvas.width, canvas.height);
    c.clearRect(0, 0, canvas.width, canvas.height)
    //buffer.clearDepthBuffer();

    let verts = fillMesh(buffer, cube0, camera, projection_matrix, aspect_ratio);
    for (let t in verts) {
        c.beginPath();
        c.moveTo(verts[t][0].x, verts[t][0].y);
        c.lineTo(verts[t][1].x, verts[t][1].y);
        c.lineTo(verts[t][2].x, verts[t][2].y);
        c.fill();
    }

    //fillMesh(buffer, cube0, camera, projection_matrix, aspect_ratio);
    //fillMesh(buffer, cube1, camera, projection_matrix);
    //fillMesh(buffer, cube2, camera, projection_matrix);
    //fillMesh(buffer, cube3, camera, projection_matrix);

    //buffer.draw();
}

window.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onkeydown = e => moveCamera(e);
window.onkeyup = e => moveCamera(e);

loop();