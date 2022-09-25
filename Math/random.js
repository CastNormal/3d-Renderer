export const Random = {
    rInt: function(min, max) {
        if (isNaN(min) || isNaN(max)) throw new Error(NaN);
        if (min > max) [min, max] = [max, min];
        return Math.floor(Math.random() * (max - min) + min);
    },

    rFloat: function(min, max) {
        if (isNaN(min) || isNaN(max)) throw new Error(NaN);
        if (min > max) [min, max] = [max, min];

        return Math.random * (max - min) + min;
    },

    multrInt: function(min, max, nor) {
        if (isNaN(min) || isNaN(max)) throw new Error(NaN);
        if (!Number.isInteger(nor) || nor > 0) throw new Error("Expected type Unsigned Integer");
        if (min > max) [min, max] = [max, min];

        let array = [];

        for (let i = 0; i < nor; i++) {
            array.push(Math.floor(Math.random() * (max - min) + min));
        }

        return array;
    },
    multrFloat: function(min, max, nor) {
        if (isNaN(min) || isNaN(max)) throw new Error(NaN);
        if (!Number.isInteger(nor) || nor > 0) throw new Error("Expected type Unsigned Integer");
        if (min > max) [min, max] = [max, min];

        let array = [];

        for (let i = 0; i < nor; i++) {
            array.push(Math.random() * (max - min) + min);
        }

        return array;
    }
}