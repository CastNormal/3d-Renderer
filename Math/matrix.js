import { Vector3 } from "./vector.js";

export const Matrix = {
    MatVecMult: function(mat, vec) {
        let x = mat[0][0] * vec.x + mat[1][0] * vec.y + mat[2][0] * vec.z + mat[3][0];
        let y = mat[0][1] * vec.x + mat[1][1] * vec.y + mat[2][1] * vec.z + mat[3][1];
        let z = mat[0][2] * vec.x + mat[1][2] * vec.y + mat[2][2] * vec.z + mat[3][2];
        let w = mat[0][3] * vec.x + mat[1][3] * vec.y + mat[2][3] * vec.z + mat[3][3];
        
        return new Vector3(x, y, z, w);
    },

    MatMult: function(m1, m2) {
        let matrix = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));

        for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 4; r++) {
                matrix[r][c] = m1[r][0] * m2[0][c] + m1[r][1] * m2[1][c] + m1[r][2] * m2[2][c] + m1[r][3] * m2[3][c];
            }
        }
        return matrix;
    },

    scale: function(scale) {
        let sx = scale.x;
        let sy = scale.y;
        let sz = scale.z;

        return [
            [ sx,  0,  0,  0  ],
            [  0, sy,  0,  0  ],
            [  0,  0, sz,  0  ],
            [  0,  0,  0,  1  ]
        ];
    },

    translate: function(v) {
        let x = v.x;
        let y = v.y;
        let z = v.z;
        return [
            [  1,  0,  0,  0  ],
            [  0,  1,  0,  0  ],
            [  0,  0,  1,  0  ],
            [ x, y, z,  1  ]
        ];
    },

    rotX: function(a) {
        let s = Math.sin(a);
        let c = Math.cos(a);

        return [
            [  1,  0,  0,  0  ],
            [  0,  c,  s,  0  ],
            [  0, -s,  c,  0  ],
            [  0,  0,  0,  1  ],
        ];
    },
    rotY: function(a) {
        let s = Math.sin(a);
        let c = Math.cos(a);

        return [
            [  c,  0, -s,  0  ],
            [  0,  1,  0,  0  ],
            [  s,  0,  c,  0  ],
            [  0,  0,  0,  1  ],
        ];
    },
    rotZ: function(a) {
        let s = Math.sin(a);
        let c = Math.cos(a);
    
        return [
            [  c,  s,  0,  0  ],
            [ -s,  c,  0,  0  ],
            [  0,  0,  1,  0  ],
            [  0,  0,  0,  1  ],
        ];
    },

    rotation: function(x, y, z) {
        return this.MatMult(this.MatMult(this.rotY(y), this.rotX(x)), this.rotZ(z));
    },

    worldMatrix: function(mesh) {
        let scale = this.scale(mesh.scale);
        let translation = this.translate(mesh.pos);
        let rotation = this.rotation(mesh.rot.x, mesh.rot.y, mesh.rot.z);
    
        return this.MatMult(this.MatMult(scale, rotation), translation);
    },

    projectionMatrix(near, far, fov, aspect_ratio) {

        let rFov = 1/Math.tan((fov * 0.5) * (Math.PI / 180));
    
        let m1 = aspect_ratio * rFov;
        let m2 = rFov;
        let m3 = far / (far - near);
        let m4 = -(far * near) / (far - near);
    
        return [
            [ m1,  0,  0,  0  ],
            [  0, m2,  0,  0  ],
            [  0,  0, m3,  1  ],
            [  0,  0, m4,  0  ]
        ];
    },
    
    screenMatrix: function(width, height) {
    
        let w = width/2;
        let h = height/2;
    
        return [
            [  w,  0,  0,  0  ],
            [  0, -h,  0,  0  ],
            [  0,  0,  1,  0  ],
            [  w,  h,  0,  0  ],
        ];
    },
    
    look_at: function(eye, target, up) {
    
        let zaxis = normalize(Vector3.sub(target, eye));
        let xaxis = normalize(Vector3.cross(up, zaxis));
        let yaxis = Vector3.cross(zaxis, xaxis);
        
        return [
            [xaxis.x,           yaxis.x,           zaxis.x,           0],
            [xaxis.y,           yaxis.y,           zaxis.y,           0],
            [xaxis.z,           yaxis.z,           zaxis.z,           0],
            [-Vector3.dot(xaxis, eye),  -Vector3.dot(yaxis, eye),  -Vector3.dot(zaxis, eye),  1]
        ];
    },
    
    FPSview: function(eye, pitch, yaw) {
        let cosPitch = Math.cos(pitch);
        let sinPitch = Math.sin(pitch);
        let cosYaw = Math.cos(yaw);
        let sinYaw = Math.sin(yaw);
    
        let xaxis = new Vector3(  cosYaw,                    0,            -sinYaw  );
        let yaxis = new Vector3(  sinYaw * sinPitch,  cosPitch,  cosYaw * sinPitch  );
        let zaxis = new Vector3(  sinYaw * cosPitch, -sinPitch,  cosPitch * cosYaw  );
    
        let viewMatrix = [
            [            xaxis.x,            yaxis.x,            zaxis.x,  0 ],
            [            xaxis.y,            yaxis.y,            zaxis.y,  0 ],
            [            xaxis.z,            yaxis.z,            zaxis.z,  0 ],
            [ -Vector3.dot( xaxis, eye ), -Vector3.dot( yaxis, eye ), -Vector3.dot( zaxis, eye ),  1 ]
        ];
        
        return viewMatrix;
    }
}