"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashInto = exports.batchHash4HashObjectInputs = exports.batchHash4UintArray64s = exports.digest64HashObjectsInto = exports.digest64HashObjects = exports.digest2Bytes32 = exports.digest64 = exports.digest = exports.SHA256 = exports.byteArrayIntoHashObject = exports.hashObjectToByteArray = exports.byteArrayToHashObject = void 0;
const wasm_1 = require("./wasm");
const hashObject_1 = require("./hashObject");
Object.defineProperty(exports, "byteArrayIntoHashObject", { enumerable: true, get: function () { return hashObject_1.byteArrayIntoHashObject; } });
Object.defineProperty(exports, "byteArrayToHashObject", { enumerable: true, get: function () { return hashObject_1.byteArrayToHashObject; } });
Object.defineProperty(exports, "hashObjectToByteArray", { enumerable: true, get: function () { return hashObject_1.hashObjectToByteArray; } });
const sha256_1 = __importDefault(require("./sha256"));
exports.SHA256 = sha256_1.default;
const ctx = wasm_1.newInstance();
const wasmInputValue = ctx.input.value;
const wasmOutputValue = ctx.output.value;
const inputUint8Array = new Uint8Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
const outputUint8Array = new Uint8Array(ctx.memory.buffer, wasmOutputValue, ctx.PARALLEL_FACTOR * 32);
const inputUint32Array = new Uint32Array(ctx.memory.buffer, wasmInputValue, ctx.INPUT_LENGTH);
function digest(data) {
    if (data.length === 64) {
        return digest64(data);
    }
    if (data.length <= ctx.INPUT_LENGTH) {
        inputUint8Array.set(data);
        ctx.digest(data.length);
        return outputUint8Array.slice(0, 32);
    }
    ctx.init();
    update(data);
    return final();
}
exports.digest = digest;
function digest64(data) {
    if (data.length === 64) {
        inputUint8Array.set(data);
        ctx.digest64(wasmInputValue, wasmOutputValue);
        return outputUint8Array.slice(0, 32);
    }
    throw new Error("InvalidLengthForDigest64");
}
exports.digest64 = digest64;
function digest2Bytes32(bytes1, bytes2) {
    if (bytes1.length === 32 && bytes2.length === 32) {
        inputUint8Array.set(bytes1);
        inputUint8Array.set(bytes2, 32);
        ctx.digest64(wasmInputValue, wasmOutputValue);
        return outputUint8Array.slice(0, 32);
    }
    throw new Error("InvalidLengthForDigest64");
}
exports.digest2Bytes32 = digest2Bytes32;
/**
 * Digest 2 objects, each has 8 properties from h0 to h7.
 * The performance is a little bit better than digest64 due to the use of Uint32Array
 * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
 * @returns
 */
function digest64HashObjects(obj1, obj2) {
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
    digest64HashObjectsInto(obj1, obj2, result);
    return result;
}
exports.digest64HashObjects = digest64HashObjects;
/**
 * Same to above but this set result to the output param to save memory.
 */
function digest64HashObjectsInto(obj1, obj2, output) {
    // TODO: expect obj1 and obj2 as HashObject
    inputUint32Array[0] = obj1.h0;
    inputUint32Array[1] = obj1.h1;
    inputUint32Array[2] = obj1.h2;
    inputUint32Array[3] = obj1.h3;
    inputUint32Array[4] = obj1.h4;
    inputUint32Array[5] = obj1.h5;
    inputUint32Array[6] = obj1.h6;
    inputUint32Array[7] = obj1.h7;
    inputUint32Array[8] = obj2.h0;
    inputUint32Array[9] = obj2.h1;
    inputUint32Array[10] = obj2.h2;
    inputUint32Array[11] = obj2.h3;
    inputUint32Array[12] = obj2.h4;
    inputUint32Array[13] = obj2.h5;
    inputUint32Array[14] = obj2.h6;
    inputUint32Array[15] = obj2.h7;
    ctx.digest64(wasmInputValue, wasmOutputValue);
    // extracting numbers from Uint32Array causes more memory
    hashObject_1.byteArrayIntoHashObject(outputUint8Array, 0, output);
}
exports.digest64HashObjectsInto = digest64HashObjectsInto;
/**
 * Hash 4 Uint8Array objects in parallel, each 64 length as below
 *
 * Inputs: i0    i1    i2    i3    i4    i5    i6    i7
 *          \    /      \    /      \   /       \   /
 * Outputs:   o0          o1          o2          o3
 */
function batchHash4UintArray64s(inputs) {
    if (inputs.length !== 4) {
        throw new Error("Input length must be 4");
    }
    for (let i = 0; i < 4; i++) {
        const input = inputs[i];
        if (input == null) {
            throw new Error(`Input ${i} is null or undefined`);
        }
        if (input.length !== 64) {
            throw new Error(`Invalid length ${input.length} at input ${i}`);
        }
    }
    // set up input buffer for v128
    inputUint8Array.set(inputs[0], 0);
    inputUint8Array.set(inputs[1], 64);
    inputUint8Array.set(inputs[2], 128);
    inputUint8Array.set(inputs[3], 192);
    ctx.batchHash4UintArray64s(wasmOutputValue);
    const output0 = outputUint8Array.slice(0, 32);
    const output1 = outputUint8Array.slice(32, 64);
    const output2 = outputUint8Array.slice(64, 96);
    const output3 = outputUint8Array.slice(96, 128);
    return [output0, output1, output2, output3];
}
exports.batchHash4UintArray64s = batchHash4UintArray64s;
/**
 * Hash 4 HashObject inputs in parallel
 *   - Each input (inputs{i}) is 4 bytes which make it 32 bytes
 *   - Each HashObject input contains 2 HashObjects which is 64 bytes similar to batchHash4UintArray64s
 *
 * Inputs      i0    i1    i2    i3    i4    i5    i6   i7
 *               \   /      \    /       \   /      \   /
 * Outputs         o0          o1          o2         o3
 * // TODO - batch: support equivalent method to hash into
 */
function batchHash4HashObjectInputs(inputs) {
    if (inputs.length !== 8) {
        throw new Error("Input length must be 8");
    }
    // inputUint8Array is 256 bytes
    // inputUint32Array is 64 items
    // v128 0
    inputUint32Array[0] = inputs[0].h0;
    inputUint32Array[1] = inputs[2].h0;
    inputUint32Array[2] = inputs[4].h0;
    inputUint32Array[3] = inputs[6].h0;
    // v128 1
    inputUint32Array[4] = inputs[0].h1;
    inputUint32Array[5] = inputs[2].h1;
    inputUint32Array[6] = inputs[4].h1;
    inputUint32Array[7] = inputs[6].h1;
    // v128 2
    inputUint32Array[8] = inputs[0].h2;
    inputUint32Array[9] = inputs[2].h2;
    inputUint32Array[10] = inputs[4].h2;
    inputUint32Array[11] = inputs[6].h2;
    // v128 3
    inputUint32Array[12] = inputs[0].h3;
    inputUint32Array[13] = inputs[2].h3;
    inputUint32Array[14] = inputs[4].h3;
    inputUint32Array[15] = inputs[6].h3;
    // v128 4
    inputUint32Array[16] = inputs[0].h4;
    inputUint32Array[17] = inputs[2].h4;
    inputUint32Array[18] = inputs[4].h4;
    inputUint32Array[19] = inputs[6].h4;
    // v128 5
    inputUint32Array[20] = inputs[0].h5;
    inputUint32Array[21] = inputs[2].h5;
    inputUint32Array[22] = inputs[4].h5;
    inputUint32Array[23] = inputs[6].h5;
    // v128 6
    inputUint32Array[24] = inputs[0].h6;
    inputUint32Array[25] = inputs[2].h6;
    inputUint32Array[26] = inputs[4].h6;
    inputUint32Array[27] = inputs[6].h6;
    // v128 7
    inputUint32Array[28] = inputs[0].h7;
    inputUint32Array[29] = inputs[2].h7;
    inputUint32Array[30] = inputs[4].h7;
    inputUint32Array[31] = inputs[6].h7;
    // v128 8
    inputUint32Array[32] = inputs[1].h0;
    inputUint32Array[33] = inputs[3].h0;
    inputUint32Array[34] = inputs[5].h0;
    inputUint32Array[35] = inputs[7].h0;
    // v128 9
    inputUint32Array[36] = inputs[1].h1;
    inputUint32Array[37] = inputs[3].h1;
    inputUint32Array[38] = inputs[5].h1;
    inputUint32Array[39] = inputs[7].h1;
    // v128 10
    inputUint32Array[40] = inputs[1].h2;
    inputUint32Array[41] = inputs[3].h2;
    inputUint32Array[42] = inputs[5].h2;
    inputUint32Array[43] = inputs[7].h2;
    // v128 11
    inputUint32Array[44] = inputs[1].h3;
    inputUint32Array[45] = inputs[3].h3;
    inputUint32Array[46] = inputs[5].h3;
    inputUint32Array[47] = inputs[7].h3;
    // v128 12
    inputUint32Array[48] = inputs[1].h4;
    inputUint32Array[49] = inputs[3].h4;
    inputUint32Array[50] = inputs[5].h4;
    inputUint32Array[51] = inputs[7].h4;
    // v128 13
    inputUint32Array[52] = inputs[1].h5;
    inputUint32Array[53] = inputs[3].h5;
    inputUint32Array[54] = inputs[5].h5;
    inputUint32Array[55] = inputs[7].h5;
    // v128 14
    inputUint32Array[56] = inputs[1].h6;
    inputUint32Array[57] = inputs[3].h6;
    inputUint32Array[58] = inputs[5].h6;
    inputUint32Array[59] = inputs[7].h6;
    // v128 15
    inputUint32Array[60] = inputs[1].h7;
    inputUint32Array[61] = inputs[3].h7;
    inputUint32Array[62] = inputs[5].h7;
    inputUint32Array[63] = inputs[7].h7;
    ctx.batchHash4HashObjectInputs(wasmOutputValue);
    const output0 = hashObject_1.byteArrayToHashObject(outputUint8Array, 0);
    const output1 = hashObject_1.byteArrayToHashObject(outputUint8Array, 32);
    const output2 = hashObject_1.byteArrayToHashObject(outputUint8Array, 64);
    const output3 = hashObject_1.byteArrayToHashObject(outputUint8Array, 96);
    return [output0, output1, output2, output3];
}
exports.batchHash4HashObjectInputs = batchHash4HashObjectInputs;
/**
 * Hash an input into preallocated input using batch if possible.
 */
function hashInto(input, output) {
    if (input.length % 64 !== 0) {
        throw new Error(`Invalid input length ${input.length}`);
    }
    if (input.length !== output.length * 2) {
        throw new Error(`Invalid output length ${output.length}`);
    }
    // for every 64 x 4 = 256 bytes, do the batch hash
    const endBatch = Math.floor(input.length / 256);
    for (let i = 0; i < endBatch; i++) {
        inputUint8Array.set(input.subarray(i * 256, (i + 1) * 256), 0);
        ctx.batchHash4UintArray64s(wasmOutputValue);
        output.set(outputUint8Array.subarray(0, 128), i * 128);
    }
    const numHashed = endBatch * 4;
    const remainingHash = Math.floor((input.length % 256) / 64);
    const inputOffset = numHashed * 64;
    const outputOffset = numHashed * 32;
    for (let i = 0; i < remainingHash; i++) {
        inputUint8Array.set(input.subarray(inputOffset + i * 64, inputOffset + (i + 1) * 64), 0);
        ctx.digest64(wasmInputValue, wasmOutputValue);
        output.set(outputUint8Array.subarray(0, 32), outputOffset + i * 32);
    }
}
exports.hashInto = hashInto;
function update(data) {
    const INPUT_LENGTH = ctx.INPUT_LENGTH;
    if (data.length > INPUT_LENGTH) {
        for (let i = 0; i < data.length; i += INPUT_LENGTH) {
            const sliced = data.slice(i, i + INPUT_LENGTH);
            inputUint8Array.set(sliced);
            ctx.update(wasmInputValue, sliced.length);
        }
    }
    else {
        inputUint8Array.set(data);
        ctx.update(wasmInputValue, data.length);
    }
}
function final() {
    ctx.final(wasmOutputValue);
    return outputUint8Array.slice(0, 32);
}
//# sourceMappingURL=index.js.map