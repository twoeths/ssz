import {BasicArrayType, CompositeArrayType, ArrayLike} from "../../types";
import {StructuralHandler} from "./abstract";

export class BasicArrayStructuralHandler<T extends ArrayLike<any>> extends StructuralHandler<T> {
  _type: BasicArrayType<T>;
  getLength(value: T): number {
    throw new Error("Not implemented");
  }
  size(value: T): number {
    return this._type.elementType.size() * this.getLength(value);
  }
  assertValidValue(value: any): void {
    if (value.length !== this.getLength(value)) {
      throw new Error("Array has invalid length");
    }
    for (let i = 0; i < this.getLength(value); i++) {
      try {
        this._type.elementType.assertValidValue(value[i]);
      } catch (e) {
        throw new Error(`Array has invalid element ${i}: ${e.message}`);
      }
    }
  }
  equals(value1: T, value2: T): boolean {
    for (let i = 0; i < this.getLength(value1); i++) {
      if (!this._type.elementType.equals(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }
  clone(value: T): T {
    const newValue = this._type.structural.defaultValue();
    for (let i = 0; i < this.getLength(value); i++) {
      newValue[i] = this._type.elementType.clone(value[i]);
    }
    return newValue;
  }
  serializeTo(value: T, output: Uint8Array, offset: number): number {
    const length = this.getLength(value);
    let index = offset;
    for (let i = 0; i < length; i++) {
      index = this._type.elementType.serializeTo(value[i], output, index);
    }
    return index;
  }
  chunk(value: T, index: number): Uint8Array {
    const output = new Uint8Array(32);
    const itemSize = this._type.elementType.size();
    const itemsInChunk = Math.floor(32 / itemSize);
    for (let i = 0, j = itemsInChunk * index; i < itemsInChunk; i += itemSize, j++) {
      this._type.elementType.serializeTo(value[j], output, i);
    }
    return output;
  }
}

export class CompositeArrayStructuralHandler<T extends ArrayLike<any>> extends StructuralHandler<T> {
  _type: CompositeArrayType<T>;
  getLength(value: T): number {
    throw new Error("Not implemented");
  }
  size(value: T): number {
    if (this._type.elementType.isVariableSize()) {
      let s = 0;
      for (let i = 0; i < this.getLength(value); i++) {
        s += this._type.elementType.structural.size(value[i]) + 4;
      }
      return s;
    } else {
      return this._type.elementType.structural.size(null) * this.getLength(value);
    }
  }
  assertValidValue(value: any): void {
    if (value.length !== this.getLength(value)) {
      throw new Error("Array has invalid length");
    }
    for (let i = 0; i < this.getLength(value); i++) {
      try {
        this._type.elementType.structural.assertValidValue(value[i]);
      } catch (e) {
        throw new Error(`Array has invalid element ${i}: ${e.message}`);
      }
    }
  }
  equals(value1: T, value2: T): boolean {
    for (let i = 0; i < this.getLength(value1); i++) {
      if (!this._type.elementType.structural.equals(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }
  clone(value: T): T {
    const newValue = this.defaultValue();
    for (let i = 0; i < this.getLength(value); i++) {
      newValue[i] = this._type.elementType.structural.clone(value[i]);
    }
    return newValue;
  }
  serializeTo(value: T, output: Uint8Array, offset: number): number {
    const length = this.getLength(value);
    if (this._type.elementType.isVariableSize()) {
      let variableIndex = offset + length * 4;
      const fixedSection = new DataView(output.buffer, output.byteOffset + offset, length * 4);
      for (let i = 0; i < length; i++) {
        // write offset
        fixedSection.setUint32(i, variableIndex - offset, true);
        // write serialized element to variable section
        variableIndex = this._type.elementType.structural.serializeTo(value[i], output, variableIndex);
      }
      return variableIndex;
    } else {
      let index = offset;
      for (let i = 0; i < length; i++) {
        index = this._type.elementType.structural.serializeTo(value[i], output, index);
      }
      return index;
    }
  }
  chunk(value: T, index: number): Uint8Array {
    return this._type.elementType.structural.hashTreeRoot(value[index]);
  }
}