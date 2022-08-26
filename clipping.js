import { dot, lerpVec3, normalize, Vector2, Vector3 } from "./Math/vector.js";

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export function nearLineClip(v1, v2, near) {

    const near_n = normalize(near);

        let d1 = dot(v1, near_n) - dot(near_n, near);
        let d2 = dot(v2, near_n) - dot(near_n, near);

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