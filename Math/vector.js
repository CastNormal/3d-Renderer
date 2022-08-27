function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        if (typeof v === Number) return new Vector2(this.x + v, this.y + v);
        else if (typeof v === Vector2) return new Vector2(this.x + v.x, this.y + v.y);
        else throw Error(NAN);
    }

    sub(v) {
        if (typeof v === Number) return new Vector2(this.x - v, this.y - v);
        else if (typeof v === Vector2) return new Vector2(this.x - v.x, this.y - v.y);
        else throw Error(NAN);
    }

    mult(v) {
        if (typeof v === Number) return new Vector2(this.x * v, this.y * v);
        else if (typeof v === Vector2) return new Vector2(this.x * v.x, this.y * v.y);
        else throw Error(NAN);
    }

    div(v) {
        if (typeof v === Number) return new Vector2(this.x / v, this.y / v);
        else if (typeof v === Vector2) return new Vector2(this.x / v.x, this.y / v.y);
        else throw Error(NAN);
    }

    lerp(v, t) {
        if (typeof v !== Vector2) throw Error('expected type ' + Vector2 + ', got ' + typeof v);
        if (typeof t !== Number) throw Error('expected type ' + Number + ', got ' + typeof t);
        return new Vector2(lerp(this.x, v.x, t), lerp(this.y, v.y, t));
    }

    dot(v) {
        if (typeof v !== Vector2) throw Error('expected type ' + Vector2 + ', got ' + typeof v);
        return this.x * v.x + this.y * v.y;
    }
}

export function subVec2(v1, v) {
    return new Vector3(v1.x - v.x, v1.y - v.y);
}

export function addVec2(v1, v) {
    return new Vector3(v1.x + v.x, v1.y + v.y);
}

export class Vector3 {
    constructor(x, y, z, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(v) {
        if (typeof v === Number) return new Vector3(this.x + v, this.y + v, this.z + v);
        else if (typeof v === Vector2) return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        else throw Error(NAN);
    }

    sub(v) {
        if (typeof v === Number) return new Vector3(this.x - v, this.y - v, this.z - v);
        else if (typeof v === Vector3) return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        else throw Error(NAN);
    }

    mult(v) {
        if (typeof v === Number) return new Vector3(this.x * v, this.y * v, this.z * v);
        else if (typeof v === Vector3) return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
        else throw Error(NAN);
    }

    div(v) {
        if (typeof v === Number) return new Vector3(this.x / v, this.y / v, this.z / v);
        else if (typeof v === Vector3) return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
        else throw Error(NAN);
    }

    lerp(v, t) {
        if (typeof v !== Vector3) throw Error('expected type ' + Vector3 + ', got ' + typeof v);
        if (typeof t !== Number) throw Error('expected type ' + Number + ', got ' + typeof t);
        return new Vector3(lerp(this.x, v.x, t), lerp(this.y, v.y, t), lerp(this.z, v.z, t), lerp(this.w, v.w, t));
    }

    dot(v) {
        if (typeof v !== Vector3) throw Error('expected type ' + Vector3 + ', got ' + typeof v);
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        if (typeof v !== Vector3) throw Error('expected type ' + Vector3 + ', got ' + typeof v);
        let vx = v1.y * v.z - v1.z * v.y;
	    let vy = v1.z * v.x - v1.x * v.z;
	    let vz = v1.x * v.y - v1.y * v.x;

	    return new Vector3(vx, vy, vz);
    }

    normal() {
        let l = Math.sqrt(this.dot(this));
        if (l != 0) return new Vector3(v.x / l, v.y / l, v.z / l);
        
        return v;
    }
}


export function subVec3(v1, v) {
    return new Vector3(v1.x - v.x, v1.y - v.y, v1.z - v.z);
}

export function addVec3(v1, v) {
    return new Vector3(v1.x + v.x, v1.y + v.y, v1.z + v.z);
}

export function lerpVec3(v1, v, t) {
    return new Vector3(
        lerp(v1.x, v.x, t),
        lerp(v1.y, v.y, t),
        lerp(v1.z, v.z, t),
        lerp(v1.w, v.w, t),
    );
}



export function cross(v1, v) {
	let vx = v1.y * v.z - v1.z * v.y;
	let vy = v1.z * v.x - v1.x * v.z;
	let vz = v1.x * v.y - v1.y * v.x;

	return new Vector3(vx, vy, vz);
}

export function dot(v1, v) {
    return v1.x * v.x + v1.y * v.y + v1.z * v.z;
}

export function normalize(v) {
    let l = Math.sqrt(dot(v, v));
    if (l != 0) return new Vector3(v.x / l, v.y / l, v.z / l);
    
    return v;
}