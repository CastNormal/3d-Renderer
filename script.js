import { Buffer, getVertex } from  "./render.js"
import { Vector2, Vector3 } from "./Math/vector.js"
import { Camera } from "./Objects/camera.js"
import { Cube, HexPrism, Mesh, Tri } from "./Objects/mesh.js"
import { Color, Black, White, Red, Green, Blue } from "./Math/color.js"
import { mat4x4VecMult, mat4x4Mult, worldMatrix/*, viewMatrix*/, projectionMatrix, screenMatrix, look_at, FPSview } from "./Math/matrix.js"

let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

let text = document.getElementById("text");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const near = 0.1;
const far = 10;
const fov = 90;
const aspect_ratio = canvas.height / canvas.width;

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
        camera.pos.z -= mv;
    }

    if (backward) {
        camera.pos.z += mv;
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
let camera = new Camera(new Vector3(0, 0, 10), new Vector3(0, 0, 0));

let cube = new Cube(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1);

let depth_buffer = new Array(canvas.width, canvas.height);

//console.log(look_at(camera.pos, camera.look_at, camera.up));

let xRot = 0, zRot = 0;

function loop() {
    window.requestAnimationFrame(loop);

    text.innerText = (mouse.x / canvas.width + 0.5) + "\n" + (mouse.y / canvas.height - 0.5) + "\n";
    xRot = (mouse.x / canvas.width - 0.5) *2;
    zRot = (mouse.y / canvas.height - 0.5) *2;


    move();

    buffer.clear(canvas.width, canvas.height, c);

    for (var i = 0; i < depth_buffer.length; i++) {
        depth_buffer[i] = 10000000;
    }

    let a = [];

    let world_matrix = worldMatrix(cube);
    let view_matrix = FPSview(camera.pos, zRot, xRot);
    let projection_matrix = projectionMatrix(near, far, fov, aspect_ratio);

    let fMatrix = mat4x4Mult(mat4x4Mult(world_matrix, view_matrix), projection_matrix);

    for (let i in cube.vertices) {

        let result = mat4x4VecMult(fMatrix, cube.vertices[i]);

        //text.innerText = result.x + "\n" + result.y + "\n" + result.z + "\n" + result.w;

        if (result.w != 0) {
            result.x /= result.w;
            result.y /= result.w;
            result.z /= result.w;
        }

        let screen = mat4x4VecMult(screenMatrix(canvas.width, canvas.height), result);
        a.push(new Vector2(screen.x, screen.y));
    }


    for (let i of cube.faces) {
        buffer.drawTriangle(a[i.v1-1], a[i.v2-1], a[i.v3-1], Black);
    }


    buffer.draw(c);
}

window.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onkeydown = e => moveCamera(e);
window.onkeyup= e => moveCamera(e);

loop();