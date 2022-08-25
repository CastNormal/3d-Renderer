import { dot, lerpVec3, normalize, Vector3 } from "./Math/vector.js";

function dotInClip(v) {
    if (v.x > v.w || v.x < -v.w) return false;
    if (v.y > v.w || v.y < -v.w) return false;
    if (v.z > v.w || v.z < 0) return false;

    return true;
}

export function clipLine1(v1, v2) {

    if (dotInClip(v1) && dotInClip(v2)) return true;
    else if (dotInClip(v1) ^ dotInClip(v2)) {
        if (v1.x > v1.w) {
            let t = (v1.w - v1.x) / ((v1.w - v1.x) - (v2.w - v2.x));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.x > v2.w) {
            let t = (v2.w - v2.x) / ((v2.w - v2.x) - (v1.w - v1.x));

            v2 = lerpVec3(v2, v1, t);
        }

        if (v1.y > v1.w) {
            let t = (v1.w - v1.y) / ((v1.w - v1.y) - (v2.w - v2.y));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.y > v2.w) {
            let t = (v2.w - v2.y) / ((v2.w - v2.y) - (v1.w - v1.y));

            v2 = lerpVec3(v2, v1, t);
        }


        if (v1.z > v1.w) {
            let t = (v1.w - v1.z) / ((v1.w - v1.z) - (v2.w - v2.z));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.z > v2.w) {
            let t = (v2.w - v2.z) / ((v2.w - v2.z) - (v1.w - v1.z));

            v2 = lerpVec3(v2, v1, t);
        }






        if (v1.x < -v1.w) {
            let t = (-v1.w - v1.x) / ((-v1.w - v1.x) - (-v2.w - v2.x));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.x < -v2.w) {
            let t = (-v2.w - v2.x) / ((-v2.w - v2.x) - (-v1.w - v1.x));

            v2 = lerpVec3(v2, v1, t);
        }

        if (v1.y < -v1.w) {
            let t = (-v1.w - v1.y) / ((-v1.w - v1.y) - (-v2.w - v2.y));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.y < -v2.w) {
            let t = (-v2.w - v2.y) / ((-v2.w - v2.y) - (-v1.w - v1.y));

            v2 = lerpVec3(v2, v1, t);
        }


        if (v1.z < -v1.w) {
            let t = (-v1.w - v1.z) / ((-v1.w - v1.z) - (-v2.w - v2.z));

            v1 = lerpVec3(v1, v2, t);
        }

        if (v2.z < -v2.w) {
            let t = (-v2.w - v2.z) / ((-v2.w - v2.z) - (-v1.w - v1.z));

            v2 = lerpVec3(v2, v1, t);
        }

        return true;
    } else return false;
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export function clipLine2(v1, v2) {
    const planes = [
        new Vector3(0, 0, 0.1),
    ];

    for (let i in planes) {
        let d1 = dot(v1, normalize(planes[i])) - dot(normalize(planes[i]), planes[i]);
        let d2 = dot(v2, normalize(planes[i])) - dot(normalize(planes[i]), planes[i]);

        if (d1 < 0 && d2 < 0) return false;
        if (d1 > 0 && d2 > 0) return true;

        if (d1 < 0) {
            let t = d1 / (d1 - d2);
            v1.x = lerp(v1.x, v2.x, t);
            v1.y = lerp(v1.y, v2.y, t);
            v1.z = lerp(v1.z, v2.z, t);
            v1.w = lerp(v1.w, v2.w, t);
            //v1 = lerpVec3(v1, v2, t);

            //console.log(v1);
        } else {
            let t = d2 / (d2 - d1);
            v2.x = lerp(v2.x, v1.x, t);
            v2.y = lerp(v2.y, v1.y, t);
            v2.z = lerp(v2.z, v1.z, t);
            v2.w = lerp(v2.w, v1.w, t);
            //v2 = lerpVec3(v2, v1, t);

        }
        
    }
    return true;
}