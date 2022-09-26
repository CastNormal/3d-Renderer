function lerp(a, b, t) {
  if (a == b) return a;
  if (t > 1) t = 1;
  if (t < 0) t = 0; 

  return (1 - t) * a + b * t;
}

function toVector2(v) {
    if (v instanceof Vector2) return v;
    else if (Array.isArray(v)) {
        if (v.length == 2) return new Vector2(v[0], v[1]);
        else if (v.length == 3) return new Vector2(v[0], v[1], v[2]);
        else return 0;
    } else return 0;
}

function operatorVector2(v1, v2, i) {

  let _v1 = toVector2(v1);
  let _v2 = toVector2(v2);

  if (!_v1 || !_v2 && typeof v2 !== "number") throw new Error("Invalid argument");
  else if (_v1 && typeof v2 === "number") {
    switch(i) {
      case 0:
        return new Vector2(_v1.x + v2, _v1.y + v2);
        break;
      case 1:
        return new Vector2(_v1.x - v2, _v1.y - v2);
        break;
      case 2:
        return new Vector2(_v1.x * v2, _v1.y * v2);
        break;
      case 3:
        return new Vector2(_v1.x / v2, _v1.y / v2);
    }
  } else {
    switch(i) {
      case 0:
        return new Vector2(_v1.x + _v2.x, _v1.y + _v2.y);
        break;
      case 1:
        return new Vector2(_v1.x - _v2.x, _v1.y - _v2.y);
        break;
      case 2:
        return new Vector2(_v1.x * _v2.x, _v1.y * _v2.y);
        break;
      case 3:
        return new Vector2(_v1.x / _v2.x, _v1.y + _v2.y);
    }
  }
}

export class Vector2 {
    constructor(x, y, w = 1) {
        if ((isNaN(x) || isNaN(y) || isNaN(w)) && x !== undefined) throw new Error("Invalid argument");
        this.x = x;
        this.y = y;
        this.w = w;
    }
    
    static add(v1, v2) { return operatorVector2(v1, v2, 0); }
    static sub(v1, v2) { return operatorVector2(v1, v2, 1); }
    static mult(v1, v2) { return operatorVector2(v1, v2, 2); }
    static div(v1, v2) { return operatorVector2(v1, v2, 3); }

    static dot = function(v1, v2) {
        let _v1 = toVector2(v1);
        let _v2 = toVector2(v2);

        if (!_v1 || !_v2) throw new Error("Invalid argument");
        return _v1.x * _v2.x + _v1.y * _v2.y;
    }

    static normal = function(v) {
        let _v = toVector2(v);
        if (!_v) throw new Error("Invalid argument");

        let length = Math.sqrt(_v.x * _v.x + _v.y * _v.y);
        return new Vector2(_v.x / length, _v.y / length);
    }

    static lerp = function(v1, v2, t) {
        let _v1 = toVector2(v1);
        let _v2 = toVector2(v2);

        if (!_v1 || !_v2 || typeof t !== "number") throw new Error("Invalid argument");
        return new Vector2(
          lerp(_v1.x, _v2.x, t),
          lerp(_v1.y, _v2.y, t),
          lerp(_v1.w, _v2.w, t)
        );
    }

    static normalize = function(v) {
        let _v = toVector2(v);
        
        if (!_v) throw new Error("Invalid Argument");
        
        return new Vector2(
            _v.x / _v.w,
            _v.y / _v.w,
            1
        );
    }
}

function toVector3(v) {
    if (v instanceof Vector3) return v;
    else if (Array.isArray(v)) {
        if (v.length == 3) return new Vector3(v[0], v[1], v[2]);
        else if (v.length == 4) return new Vector3(v[0], v[1], v[2], v[3]);
        else return 0;
    } else return 0;
}

function operatorVector3(v1, v2, i) {

  let _v1 = toVector3(v1);
  let _v2 = toVector3(v2);

  if (!_v1 || !_v2 && typeof v2 !== "number") throw new Error("Invalid argument");
  else if (_v1 && typeof v2 === "number") {
    switch(i) {
      case 0:
        return new Vector3(_v1.x + v2, _v1.y + v2, _v1.z + v2);
        break;
      case 1:
        return new Vector3(_v1.x - v2, _v1.y - v2, _v1.z - v2);
        break;
      case 2:
        return new Vector3(_v1.x * v2, _v1.y * v2, _v1.z * v2);
        break;
      case 3:
        return new Vector3(_v1.x / v2, _v1.y / v2, _v1.z / v2);
    }
  } else {
    switch(i) {
      case 0:
        return new Vector3(_v1.x + _v2.x, _v1.y + _v2.y, _v1.z + _v2.z);
        break;
      case 1:
        return new Vector3(_v1.x - _v2.x, _v1.y - _v2.y, _v1.z - _v2.z);
        break;
      case 2:
        return new Vector3(_v1.x * _v2.x, _v1.y * _v2.y, _v1.z * _v2.z);
        break;
      case 3:
        return new Vector3(_v1.x / _v2.x, _v1.y + _v2.y, _v1.z / _v2.z);
    }
  }
}

export class Vector3 {
    constructor(x, y, z, w = 1) {
        if ((isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w)) && x !== undefined) throw new Error("Invalid argument");
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    
    static add(v1, v2) { return operatorVector3(v1, v2, 0); }
    static sub(v1, v2) { return operatorVector3(v1, v2, 1); }
    static mult(v1, v2) { return operatorVector3(v1, v2, 2); }
    static div(v1, v2) { return operatorVector3(v1, v2, 3); }

    static dot = function(v1, v2) {
        let _v1 = toVector3(v1);
        let _v2 = toVector3(v2);

        if (!_v1 || !_v2) throw new Error("Invalid argument");
        return _v1.x * _v2.x + _v1.y * _v2.y + _v1.z * _v2.z;
    }

    static normal = function(v) {
        let _v = toVector3(v);
        if (!_v) throw new Error("Invalid argument");

        let length = Math.sqrt(_v.x * _v.x + _v.y * _v.y + _v.z * _v.z);
        return new Vector3(_v.x / length, _v.y / length, _v.z / length);
    }

    static cross = function(v1, v2) {
        let _v1 = toVector3(v1);
        let _v2 = toVector3(v2);

        if (!_v1 || !_v2) throw new Error("Invalid argument");

        return new Vector3(
            _v1.y * _v2.z - _v1.z * _v2.y,
            _v1.z * _v2.x - _v1.x * _v2.z,
            _v1.x * _v2.y - _v1.y * _v2.x
        );
    }

    static lerp = function(v1, v2, t) {
        let _v1 = toVector3(v1);
        let _v2 = toVector3(v2);

        if (!_v1 || !_v2 || typeof t !== "number") throw new Error("Invalid argument");
        return new Vector3(
            lerp(_v1.x, _v2.x, t),
            lerp(_v1.y, _v2.y, t),
            lerp(_v1.z, _v2.z, t),
            lerp(_v1.w, _v2.w, t)
        );
    }

    static normalize = function(v) {
        let _v = toVector3(v);
        
        if (!_v) throw new Error("Invalid Argument");
        
        return new Vector3(
            _v.x / _v.w,
            _v.y / _v.w,
            _v.z / _v.w,
            1
        );
    }
}
