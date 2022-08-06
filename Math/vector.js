export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function subVec2(v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y);
}

export function addVec2(v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y);
}

export class Vector3 {
    constructor(x, y, z, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

export function subVec3(v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

export function addVec3(v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}