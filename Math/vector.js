function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }

    sub(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

    mult(v2) {
        this.x *= v2.x;
        this.y *= v2.y;
    }

    div(v2) {
        this.x /= v2.x;
        this.y /= v2.y;
    }

    lerp(v2, t) {
        this.x = lerp(this.x, v2.x, t);
        this.y = lerp(this.y, v2.y, t);
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

}

export class Vector3 {
    constructor(x, y, z, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
        this.z += v2.z;
    }

    sub(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        this.z -= v2.z;
    }

    mult(v2) {
        this.x *= v2.x;
        this.y *= v2.y;
        this.z *= v2.z;
    }

    div(v2) {
        this.x /= v2.x;
        this.y /= v2.y;
        this.z /= v2.z;
    }

    lerp(v2, t) {
        this.x = lerp(this.x, v2.x, t);
        this.y = lerp(this.y, v2.y, t);
        this.z = lerp(this.z, v2.z, t);
        this.w = lerp(this.w, v2.w, t);
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z;
    }

    cross(v2) {
        let vx = v1.y * v2.z - v1.z * v2.y;
	    let vy = v1.z * v2.x - v1.x * v2.z;
	    let vz = v1.x * v2.y - v1.y * v2.x;

	    return new Vector3(vx, vy, vz); 
    }

    normalize() {
        let l = Math.sqrt(dot(v, v));
        if (l != 0) {
            this.div(new Vector3(l, l, l));
        }
    }

    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}