import { Vector3 } from "../Math/vector.js";

export class Mesh {
    vertices = [ new Vector3(0, 0, 0) ];
    faces = [];

    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0), scale = 1) {
        this.pos = position;
        this.rot = rotation;
        this.scale = scale;


    }
}

export class Tri {
    constructor(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }
}

export class Cube extends Mesh {

    constructor(position, rotation, scale) {
        super(position, rotation, scale);

        this.vertices = [
            new Vector3(-1,  1,  1),
            new Vector3(-1, -1,  1),
            new Vector3(-1,  1, -1),
            new Vector3(-1, -1, -1),
            new Vector3( 1,  1,  1),
            new Vector3( 1, -1,  1),
            new Vector3( 1,  1, -1),
            new Vector3( 1, -1, -1)
        ];
    
        this.faces = [
            new Tri(5, 3, 1),
            new Tri(3, 8, 4),
            new Tri(7, 6, 8),
            new Tri(2, 8, 6),
            new Tri(1, 4, 2),
            new Tri(5, 2, 6),
            new Tri(5, 7, 3),
            new Tri(3, 7, 8),
            new Tri(7, 5, 6),
            new Tri(2, 4, 8),
            new Tri(1, 3, 4),
            new Tri(5, 1, 2)
        ];
    }
}


export class HexPrism extends Mesh {

    constructor(position, rotation, scale) {
        super(position, rotation, scale);

        this.vertices = [
            new Vector3(0, -1, 1),
            new Vector3(0, 1, 1),
            new Vector3(-0.866025, -1, 0.5),
            new Vector3(-0.866025, 1, 0.5),
            new Vector3(-0.866025, -1, -0.5),
            new Vector3(-0.866025, 1, -0.5),
            new Vector3(0, -1, -1),
            new Vector3(0, 1, -1),
            new Vector3(0.866025, -1, -0.5),
            new Vector3(0.866025, 1, -0.5),
            new Vector3(0.866025, -1, 0.5),
            new Vector3(0.866025, 1, 0.5)
        ];
    
        this.faces = [
            new Tri(2, 3, 1),
            new Tri(4, 5, 3),
            new Tri(6, 7, 5),
            new Tri(8, 9, 7),
            new Tri(2, 10, 6),
            new Tri(10, 11, 9),
            new Tri(12, 1, 11),
            new Tri(9, 11, 3),
            new Tri(2, 4, 3),
            new Tri(4, 6, 5),
            new Tri(6, 8, 7),
            new Tri(8, 10, 9),
            new Tri(6, 4, 2),
            new Tri(2, 12, 10),
            new Tri(10, 8, 6),
            new Tri(10, 12, 11),
            new Tri(12, 2, 1),
            new Tri(11, 1, 3),
            new Tri(3, 5, 7),
            new Tri(7, 9, 3)
        ];
    }
}

export class Obj extends Mesh {
    constructor(file_name, position, rotation, scale) {
        super(position, rotation, scale);

        fetch(file_name).then(response => {
            return response.text();
        }).then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i] == 'v' && data[i+1] == ' ') {
                    i += 2;
                    let string = "";
                    while (data[i] !== '\n') {
                        string += data[i];
                        i++;
                    }

                    let nums = string.split(' ');

                    this.vertices.push(new Vector3(nums[0], nums[1], nums[2]));
                } else if (data[i] == 'f' && data[i+1] == ' ') {
                    i += 2;
                    let string = "";
                    while (data[i] !== '\n') {
                        string += data[i];
                        i++;
                    }

                    let nums = string.split(' ');

                    this.faces.push(new Tri(nums[0], nums[1], nums[2]));
                }
            }
        });

    }
}