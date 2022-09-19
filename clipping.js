import { Vector2, Vector3 } from "./Math/vector.js";

function lerp(a, b, t) {

    if (a == b) return a;
    if (t < 0) t = 0;
    if (t > 1) t = 1;

    return a * (1 - t) + b * t;
}

export function nearLineClip(v1, v2, near) {

    let near_v = new Vector3(0, 0, near);
    let near_n = Vector3.normal(near_v);

        let d1 = Vector3.dot(v1, near_n) - Vector3.dot(near_n, near_v);
        let d2 = Vector3.dot(v2, near_n) - Vector3.dot(near_n, near_v);

        if (d1 < 0 && d2 < 0) return false;
        if (d1 > 0 && d2 > 0) return true;

        if (d1 < 0) {
            let t = d1 / (d1 - d2);
            v1.x = lerp(v1.x, v2.x, t);
            v1.y = lerp(v1.y, v2.y, t);
            v1.z = lerp(v1.z, v2.z, t);
            v1.w = lerp(v1.w, v2.w, t);
            //v1 = lerpVec3(v1, v2, t);

        } else {
            let t = d2 / (d2 - d1);
            v2.x = lerp(v2.x, v1.x, t);
            v2.y = lerp(v2.y, v1.y, t);
            v2.z = lerp(v2.z, v1.z, t);
            v2.w = lerp(v2.w, v1.w, t);
            //v2 = lerpVec3(v2, v1, t);

        
    }
    return true;
}

function oneVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v1 is the vert that passes test

    let t2 = d2 / (d2 - d1);
    let t3 = d3 / (d3 - d1);

    return [[v1, uv1], [Vector3.lerp(v2, v1, t2), Vector2.lerp(uv2, uv1, t2)], [Vector3.lerp(v3, v1, t3), Vector2.lerp(uv3, uv1, t3)]];
}

function twoVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v1 and v2 are the verts that pass

    let t2 = d1 / (d1 - d2);
    let t3 = d1 / (d1 - d3);

    return [[v2, uv2], [v3, uv3], [Vector3.lerp(v1, v3, t3), Vector2.lerp(uv1, uv3, t3)], [Vector3.lerp(v1, v2, t2), Vector2.lerp(uv1, uv2, t2)]];
}

export function planeTriClip(v1, v2, v3, uv1, uv2, uv3, vertices, plane, plane_n) {
    const plane_d = -Vector3.dot(plane_n, plane);

    let d1 = Vector3.dot(v1, plane_n) + plane_d;
    let d2 = Vector3.dot(v2, plane_n) + plane_d;
    let d3 = Vector3.dot(v3, plane_n) + plane_d;


    if (d1 > 0 && d2 > 0 && d3 > 0) { //All pass
        vertices.push([v1, uv1], [v2, uv2], [v3, uv3]);
        return true;

    } else if (d1 < 0 && d2 < 0 && d3 < 0) { //None Pass
        return false;
        
    } else if (d1 > 0 ^ d2 > 0 ^ d3 > 0) { //only one vertex passes
        if (d1 > 0) {
            for (let i of oneVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3)) vertices.push(i);
            return true;
            
        } else if (d2 > 0) {
            for (let i of oneVertClip(v2, v1, v3, uv2, uv1, uv3, d2, d1, d3)) vertices.push(i);
            return true;
            
        } else if (d3 > 0) {
            for (let i of oneVertClip(v3, v1, v2, uv3, uv1, uv2, d3, d1, d2)) vertices.push(i);
            return true;
        }
    } else { //two vertices pass
        if (d1 < 0) {
            for (let i of twoVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3)) vertices.push(i);
            return true;
        } else if (d2 < 0) {
            for (let i of twoVertClip(v2, v1, v3, uv2, uv1, uv3, d2, d1, d3)) vertices.push(i);
            return true;
        } else if (d3 < 0) {
            for (let i of twoVertClip(v3, v1, v2, uv3, uv1, uv2, d3, d1, d2)) vertices.push(i);
            return true;
        }
    }
}

export function LineClip2d(v1, v2, bx, by, bwidth, bheight) {

    let xmin = bx;
    let ymin = by;
    let xmax = bx + bwidth;
    let ymax = by + bheight;

    let p1 = -(v2.x - v1.x);
    let p2 = -p1;
    let p3 = -(v2.y - v1.y);
    let p4 = -p3;

    let q1 = v1.x - xmin;
    let q2 = xmax - v1.x;
    let q3 = v1.y - ymin;
    let q4 = ymax - v1.y;

    let posarr = [1];
    let negarr = [0];


    if ((p1 == 0 && q1 < 0) || (p2 == 0 && q2 < 0) || (p3 == 0 && q3 < 0) || (p4 == 0 && q4 < 0)) return false; //Line is parallel to clipping rect

    if (p1 != 0) {
        let r1 = q1 / p1;
        let r2 = q2 / p2;

        if (p1 < 0) {
            negarr.push(r1); // for negative p1, add it to negative array
            posarr.push(r2); // and add p2 to positive array
        } else {
            negarr.push(r2);
            posarr.push(r1);
        }
    }

    if (p3 != 0) {
        let r3 = q3 / p3;
        let r4 = q4 / p4;

        if (p3 < 0) {
            negarr.push(r3);
            posarr.push(r4);
        } else {
            negarr.push(r4);
            posarr.push(r3);
        }
    }

    let rn1 = Math.max(...negarr); // maximum of negative array
    let rn2 = Math.min(...posarr); // minimum of positive array

    if (rn1 > rn2) return false; // reject


    let n1 = new Vector2(v1.x + p2 * rn1, v1.y + p4 * rn1);
    let n2 = new Vector2(v1.x + p2 * rn2, v1.y + p4 * rn2);

    v1.x = n1.x;
    v1.y = n1.y;
    v2.x = n2.x;
    v2.y = n2.y;

    return true;
}