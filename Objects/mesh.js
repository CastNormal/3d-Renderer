import { Vector3, Vector2 } from "../Math/vector.js";

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
    constructor(v1, v2, v3, uv1, uv2, uv3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.uv1 = uv1;
        this.uv2 = uv2;
        this.uv3 = uv3;
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
            new Tri(4, 2, 0, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(2, 7, 3, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(6, 5, 7, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(1, 7, 5, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(0, 3, 1, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(4, 1, 5, new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)),
            new Tri(4, 6, 2, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)),
            new Tri(2, 6, 7, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)),
            new Tri(6, 4, 5, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)),
            new Tri(1, 3, 7, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)),
            new Tri(0, 2, 3, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)),
            new Tri(4, 0, 1, new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1))
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
                    while (data[i] !== '\n' && data[i] !== '\r') {
                        string += data[i];
                        i++;
                    }

                    let nums = string.split(' ');

                    this.vertices.push(new Vector3(parseFloat(nums[0]), parseFloat(nums[1]), parseFloat(nums[2])));
                } else if (data[i] == 'f' && data[i+1] == ' ') {
                    i += 2;
                    let string = "";
                    while (data[i] !== '\n' && data[i] !== '\r') {
                        string += data[i];
                        i++;
                    }

                    let nums = string.split(' ');

                    this.faces.push(new Tri(parseInt(nums[0]), parseInt(nums[1]), parseInt(nums[2])));
                }
            }

            console.log(this.vertices, this.faces)
        });

    }
}