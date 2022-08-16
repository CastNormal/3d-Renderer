import { Vector2, Vector3 } from "../Math/vector.js";

export class Camera {
    constructor(postion, rotation) {
        this.pos = postion;
        this.rot = rotation;

        this.up = new Vector3(0, 1, 0);
        this.target = new Vector3(0, 0, -1);
    }
}