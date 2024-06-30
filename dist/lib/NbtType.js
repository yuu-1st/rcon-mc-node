class NbtType {
    data;
    type;
    constructor(value, type) {
        this.data = value;
        this.type = type;
    }
    get() {
        return this.data;
    }
    value() {
        return this.data;
    }
    getType() {
        return this.type;
    }
    set(value) {
        this.data = value;
    }
}
class NbtNumber extends NbtType {
}
export class NbtInt extends NbtNumber {
    static adjustValue(value) {
        value = Math.round(value);
        return value % 0x80000000;
    }
    constructor(value) {
        super(NbtInt.adjustValue(value), 'int');
    }
    add(value) {
        return new NbtInt(this.get() + value.get());
    }
    sub(value) {
        return new NbtInt(this.get() - value.get());
    }
    mul(value) {
        return new NbtInt(this.get() * value.get());
    }
    div(value) {
        return new NbtInt(this.get() / value.get());
    }
    toString() {
        return `${this.data}`;
    }
}
export class NbtByte extends NbtNumber {
    static adjustValue(value) {
        value = Math.round(value);
        return value % 0x80;
    }
    constructor(value) {
        super(NbtByte.adjustValue(value), 'byte');
    }
    add(value) {
        return new NbtByte(this.get() + value.get());
    }
    sub(value) {
        return new NbtByte(this.get() - value.get());
    }
    mul(value) {
        return new NbtByte(this.get() * value.get());
    }
    div(value) {
        return new NbtByte(this.get() / value.get());
    }
    toString() {
        return `${this.data}b`;
    }
}
export class NbtShort extends NbtNumber {
    static adjustValue(value) {
        value = Math.round(value);
        return value % 0x8000;
    }
    constructor(value) {
        super(NbtShort.adjustValue(value), 'short');
    }
    add(value) {
        return new NbtShort(this.get() + value.get());
    }
    sub(value) {
        return new NbtShort(this.get() - value.get());
    }
    mul(value) {
        return new NbtShort(this.get() * value.get());
    }
    div(value) {
        return new NbtShort(this.get() / value.get());
    }
    toString() {
        return `${this.data}s`;
    }
}
export class NbtLong extends NbtNumber {
    static adjustValue(value) {
        value = Math.round(value);
        return value % 0x8000000000000000;
    }
    constructor(value) {
        super(NbtLong.adjustValue(value), 'long');
    }
    add(value) {
        return new NbtLong(this.get() + value.get());
    }
    sub(value) {
        return new NbtLong(this.get() - value.get());
    }
    mul(value) {
        return new NbtLong(this.get() * value.get());
    }
    div(value) {
        return new NbtLong(this.get() / value.get());
    }
    toString() {
        return `${this.data}l`;
    }
}
export class NbtFloat extends NbtNumber {
    static adjustValue(value) {
        const float32Array = new Float32Array(1);
        float32Array[0] = value;
        return float32Array[0];
    }
    constructor(value) {
        super(NbtFloat.adjustValue(value), 'float');
    }
    add(value) {
        return new NbtFloat(this.get() + value.get());
    }
    sub(value) {
        return new NbtFloat(this.get() - value.get());
    }
    mul(value) {
        return new NbtFloat(this.get() * value.get());
    }
    div(value) {
        return new NbtFloat(this.get() / value.get());
    }
    toString() {
        return `${this.data % 1 === 0 ? this.data.toFixed(1) : this.data}f`;
    }
}
export class NbtDouble extends NbtNumber {
    static adjustValue(value) {
        const float64Array = new Float64Array(1);
        float64Array[0] = value;
        return float64Array[0];
    }
    constructor(value) {
        super(NbtDouble.adjustValue(value), 'double');
    }
    add(value) {
        return new NbtDouble(this.get() + value.get());
    }
    sub(value) {
        return new NbtDouble(this.get() - value.get());
    }
    mul(value) {
        return new NbtDouble(this.get() * value.get());
    }
    div(value) {
        return new NbtDouble(this.get() / value.get());
    }
    toString() {
        return `${this.data % 1 === 0 ? this.data.toFixed(1) : this.data}d`;
    }
}
export class NbtBoolean extends NbtType {
    constructor(value) {
        super(value, 'boolean');
    }
    toString() {
        return this.data ? 'true' : 'false';
    }
}
export class NbtString extends NbtType {
    constructor(value) {
        super(value, 'string');
    }
    toString() {
        return `"${this.data}"`;
    }
}
export class NbtList extends NbtType {
    constructor(value) {
        super(value, 'list');
    }
    toString() {
        return `[${this.data.map(item => item.toString()).join(', ')}]`;
    }
}
export class NbtCompound extends NbtType {
    constructor(value) {
        super(value, 'compound');
    }
    toString() {
        return `{${Object.entries(this.data)
            .map(([key, value]) => `${key}: ${value.toString()}`)
            .join(', ')}}`;
    }
}
export class NbtByteArray extends NbtType {
    constructor(value) {
        super(value, 'byteArray');
    }
    toString() {
        return `[B; ${this.data.map(item => item.toString()).join(', ')}]`;
    }
}
export class NbtIntArray extends NbtType {
    constructor(value) {
        super(value, 'intArray');
    }
    toString() {
        return `[I; ${this.data.map(item => item.toString()).join(', ')}]`;
    }
}
export class NbtLongArray extends NbtType {
    constructor(value) {
        super(value, 'longArray');
    }
    toString() {
        return `[L; ${this.data.map(item => item.toString()).join(', ')}]`;
    }
}
//# sourceMappingURL=NbtType.js.map