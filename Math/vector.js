export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }
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