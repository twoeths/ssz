"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteArrayIntoHashObject = exports.byteArrayToHashObject = exports.hashObjectToByteArray = void 0;
/**
 * Pass 8 numbers in an object and set that to inputArray.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
function hashObjectToByteArray(obj, byteArr, offset) {
    let tmp = obj.h0;
    byteArr[0 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[1 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[2 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[3 + offset] = tmp & 0xff;
    tmp = obj.h1;
    byteArr[4 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[5 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[6 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[7 + offset] = tmp & 0xff;
    tmp = obj.h2;
    byteArr[8 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[9 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[10 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[11 + offset] = tmp & 0xff;
    tmp = obj.h3;
    byteArr[12 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[13 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[14 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[15 + offset] = tmp & 0xff;
    tmp = obj.h4;
    byteArr[16 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[17 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[18 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[19 + offset] = tmp & 0xff;
    tmp = obj.h5;
    byteArr[20 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[21 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[22 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[23 + offset] = tmp & 0xff;
    tmp = obj.h6;
    byteArr[24 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[25 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[26 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[27 + offset] = tmp & 0xff;
    tmp = obj.h7;
    byteArr[28 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[29 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[30 + offset] = tmp & 0xff;
    tmp = tmp >> 8;
    byteArr[31 + offset] = tmp & 0xff;
}
exports.hashObjectToByteArray = hashObjectToByteArray;
/**
 * Parse outputArray into an object of 8 numbers.
 * This is the order that makes Uint32Array the same to Uint8Array
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
function byteArrayToHashObject(byteArr, offset) {
    const result = {
        h0: 0,
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0,
        h6: 0,
        h7: 0,
    };
    byteArrayIntoHashObject(byteArr, offset, result);
    return result;
}
exports.byteArrayToHashObject = byteArrayToHashObject;
/**
 * Same to above but this set result to the output param to save memory.
 */
function byteArrayIntoHashObject(byteArr, offset, output) {
    let tmp = 0;
    tmp |= byteArr[3 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[2 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[1 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[0 + offset] & 0xff;
    output.h0 = tmp;
    tmp = 0;
    tmp |= byteArr[7 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[6 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[5 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[4 + offset] & 0xff;
    output.h1 = tmp;
    tmp = 0;
    tmp |= byteArr[11 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[10 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[9 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[8 + offset] & 0xff;
    output.h2 = tmp;
    tmp = 0;
    tmp |= byteArr[15 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[14 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[13 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[12 + offset] & 0xff;
    output.h3 = tmp;
    tmp = 0;
    tmp |= byteArr[19 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[18 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[17 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[16 + offset] & 0xff;
    output.h4 = tmp;
    tmp = 0;
    tmp |= byteArr[23 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[22 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[21 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[20 + offset] & 0xff;
    output.h5 = tmp;
    tmp = 0;
    tmp |= byteArr[27 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[26 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[25 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[24 + offset] & 0xff;
    output.h6 = tmp;
    tmp = 0;
    tmp |= byteArr[31 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[30 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[29 + offset] & 0xff;
    tmp = tmp << 8;
    tmp |= byteArr[28 + offset] & 0xff;
    output.h7 = tmp;
}
exports.byteArrayIntoHashObject = byteArrayIntoHashObject;
//# sourceMappingURL=hashObject.js.map