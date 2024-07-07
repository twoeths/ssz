import { HashObject, byteArrayToHashObject, hashObjectToByteArray } from "./hashObject";
import SHA256 from "./sha256";
export { HashObject, byteArrayToHashObject, hashObjectToByteArray, SHA256 };
export declare function digest(data: Uint8Array): Uint8Array;
export declare function digest64(data: Uint8Array): Uint8Array;
export declare function digest2Bytes32(bytes1: Uint8Array, bytes2: Uint8Array): Uint8Array;
/**
 * Digest 2 objects, each has 8 properties from h0 to h7.
 * The performance is a little bit better than digest64 due to the use of Uint32Array
 * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
 * @returns
 */
export declare function digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject;
/**
 * Hash 4 Uint8Array objects in parallel, each 64 length as below
 *
 * Inputs: i0    i1    i2    i3    i4    i5    i6    i7
 *          \    /      \    /      \   /       \   /
 * Outputs:   o0          o1          o2          o3
 */
export declare function batchHash4UintArray64s(inputs: Uint8Array[]): Uint8Array[];
/**
 * Hash 4 HashObject inputs in parallel
 *   - Each input (inputs{i}) is 4 bytes which make it 32 bytes
 *   - Each HashObject input contains 2 HashObjects which is 64 bytes similar to batchHash4UintArray64s
 *
 * Inputs      i0    i1    i2    i3    i4    i5    i6   i7
 *               \   /      \    /       \   /      \   /
 * Outputs         o0          o1          o2         o3
 */
export declare function batchHash4HashObjectInputs(inputs: HashObject[]): HashObject[];
//# sourceMappingURL=index.d.ts.map