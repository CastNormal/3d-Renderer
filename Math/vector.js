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

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export function lerpVec3(v1, v2, t) {
    return new Vector3(
        lerp(v1.x, v2.x, t),
        lerp(v1.y, v2.y, t),
        lerp(v1.z, v2.z, t),
        lerp(v1.w, v2.w, t),
    );
}



export function cross(v1, v2) {
	let vx = v1.y * v2.z - v1.z * v2.y;
	let vy = v1.z * v2.x - v1.x * v2.z;
	let vz = v1.x * v2.y - v1.y * v2.x;

	return new Vector3(vx, vy, vz);
}

export function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function normalize(v) {
    let l = Math.sqrt(dot(v, v));
    if (l != 0) return new Vector3(v.x / l, v.y / l, v.z / l);
    
    return v;
}