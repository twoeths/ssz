/**
 * This is a hash representation with 8 numbers, each 4 bytes.
 * That makes it 32 bytes, the same to Uint8Array(32).
 */
export interface HashObject {
    h0: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    h7: number;
}
/**
 * Pass 8 numbers in an object and set that to inputArray.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
export declare function hashObjectToByteArray(obj: HashObject, byteArr: Uint8Array, offset: number): void;
/**
 * Parse outputArray into an object of 8 numbers.
 * This is the order that makes Uint32Array the same to Uint8Array
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
export declare function byteArrayToHashObject(byteArr: Uint8Array, offset: number): HashObject;
/**
 * Same to above but this set result to the output param to save memory.
 */
export declare function byteArrayIntoHashObject(byteArr: Uint8Array, offset: number, output: HashObject): void;
//# sourceMappingURL=hashObject.d.ts.map