import { Vector2, Vector3 } from "../Math/vector.js";

export class Camera {
    constructor(postion, rotation) {
        this.pos = postion;
        this.rot = rotation;

        this.right =   new Vector3(1, 0, 0, 0);
        this.up =      new Vector3(0, 1, 0, 0);
        this.forward = new Vector3(0, 0, 1, 0);
        this.postion = new Vector3(0, 0, 0, 1);

        this.direction = new Vector3(0, 0, 0);
        this.look_at = new Vector3(0, 0, 0);
    }
}