import { Vector2, Vector3 } from "./Math/vector.js";

function lerp(a, b, t) {
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
/*
function oneVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v1 is the vert that passes test

    let t2 = d2 / (d2 - d1);
    let t3 = d3 / (d3 - d1);


    let _v2 = Vector3.lerp(v2, v1, t2);
    let _v3 = Vector3.lerp(v3, v1, t3);
    let _uv2 = Vector2.lerp(uv2, uv1, t2);
    let _uv3 = Vector2.lerp(uv3, uv1, t3);


    return [[v1, _v2, _v3], [uv1, _uv2, _uv3]];
}

function twoVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v1 and v2 are the verts that pass

    let t2 = d1 / (d1 - d2);
    let t3 = d1 / (d1 - d3);

    let _v2 = Vector3.lerp(v1, v2, t2);
    let _v3 = Vector3.lerp(v1, v3, t3);
    let _uv2 = Vector2.lerp(uv1, uv2, t2);
    let _uv3 = Vector2.lerp(uv1, uv3, t3);


    return [[ [v2, v3, _v3], [_v3, _v2, v2] ], [ [uv2, uv3, _uv3], [_uv3, _uv2, uv2] ]];
}
*/

function oneVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v1 is the vert that passes test

    let t2 = d2 / (d2 - d1);
    let t3 = d3 / (d3 - d1);


    let _v2 = Vector3.lerp(v2, v1, t2);
    let _v3 = Vector3.lerp(v3, v1, t3);
    let _uv2 = Vector2.lerp(uv2, uv1, t2);
    let _uv3 = Vector2.lerp(uv3, uv1, t3);

    return [[v1, _v2, _v3], [uv1, _uv2, _uv3]];
}

function twoVertClip(v1, v2, v3, uv1, uv2, uv3, d1, d2, d3) { //v2 and v3 are the verts that pass

    let t2 = d1 / (d1 - d2);
    let t3 = d1 / (d1 - d3);

    let _v2 = Vector3.lerp(v1, v2, t2);
    let _v3 = Vector3.lerp(v1, v3, t3);
    let _uv2 = Vector2.lerp(uv1, uv2, t2);
    let _uv3 = Vector2.lerp(uv1, uv3, t3);
    
    return [[[v2, v3, _v3], [_v3, _v2, v2]], [[uv2, uv3, _uv3], [_uv3, _uv2, uv2]]];
}


export function TriClip(verts, texts) {
    let texture = [...texts];
    let vertices = [...verts];

    for (let i = 0; i < 1; i++) {
        //let i = 0;
        //let j = 0;
        let ver = [];
        let tex = [];
        for (let j in vertices) {
            let v1 = vertices[j][0];
            let v2 = vertices[j][1];
            let v3 = vertices[j][2];

            let uv1 = texture[j][0];
            let uv2 = texture[j][1];
            let uv3 = texture[j][2];

            let d1 = [v1.z,/* v1.w - v1.z,*/ v1.w + v1.x, v1.w - v1.x, v1.w + v1.y, v1.w - v1.y];
            let d2 = [v2.z,/* v2.w - v2.z,*/ v2.w + v2.x, v2.w - v2.x, v2.w + v2.y, v2.w - v2.y];
            let d3 = [v3.z,/* v3.w - v3.z,*/ v3.w + v3.x, v3.w - v3.x, v3.w + v3.y, v3.w - v3.y];

            if (d1[i] >= 0 && d2[i] >= 0 && d3[i] >= 0) {
                ver.push([v1, v2, v3]);
                tex.push([uv1, uv2, uv3]);
            } else if (d1[i] < 0 && d2[i] < 0 && d3[i] < 0) return false;
            else if (d1[i] >= 0 ^ d2[i] >= 0 ^ d3[i] >= 0) {
                if (d1[i] >= 0) {
                    let v = oneVertClip(v1, v2, v3, uv1, uv2, uv3, d1[i], d2[i], d3[i]);
                    ver.push(v[0]);
                    tex.push(v[1]);
                } else if (d2[i] >= 0) {
                    let v = oneVertClip(v2, v1, v3, uv2, uv1, uv3, d2[i], d1[i], d3[i]);
                    ver.push(v[0]);
                    tex.push(v[1]);
                } else {
                    let v = oneVertClip(v3, v1, v2, uv3, uv1, uv2, d3[i], d1[i], d2[i]);
                    ver.push(v[0]);
                    tex.push(v[1]);
                }
            } else {
                if (d1[i] < 0) {
                    let v = twoVertClip(v1, v2, v3, uv1, uv2, uv3, d1[i], d2[i], d3[i]);
                    ver.push(v[0][0], v[0][1]);
                    tex.push(v[1][0], v[1][1]);
                } else if (d2[i] < 0) {
                    let v = twoVertClip(v2, v1, v3, uv2, uv1, uv3, d2[i], d1[i], d3[i]);
                    ver.push(v[0][0], v[0][1]);
                    tex.push(v[1][0], v[1][1]);
                } else {
                    let v = twoVertClip(v3, v1, v2, uv3, uv1, uv2, d3[i], d1[i], d2[i]);
                    ver.push(v[0][0], v[0][1]);
                    tex.push(v[1][0], v[1][1]);
                }
            }
        }
        vertices = [...ver];
        texture = [...tex];
    }

    return [vertices, texture];
}