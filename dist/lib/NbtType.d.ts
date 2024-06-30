declare abstract class NbtType<T> {
    protected data: T;
    protected type: string;
    constructor(value: T, type: string);
    get(): T;
    value(): T;
    getType(): string;
    set(value: T): void;
    abstract toString(): string;
}
declare abstract class NbtNumber extends NbtType<number> {
    abstract add(value: NbtNumber): NbtNumber;
    abstract sub(value: NbtNumber): NbtNumber;
    abstract mul(value: NbtNumber): NbtNumber;
    abstract div(value: NbtNumber): NbtNumber;
}
export declare class NbtInt extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtByte extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtShort extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtLong extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtFloat extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtDouble extends NbtNumber {
    private static adjustValue;
    constructor(value: number);
    add(value: NbtNumber): NbtNumber;
    sub(value: NbtNumber): NbtNumber;
    mul(value: NbtNumber): NbtNumber;
    div(value: NbtNumber): NbtNumber;
    toString(): string;
}
export declare class NbtBoolean extends NbtType<boolean> {
    constructor(value: boolean);
    toString(): string;
}
export declare class NbtString extends NbtType<string> {
    constructor(value: string);
    toString(): string;
}
export declare class NbtList<T, N extends NbtType<T>> extends NbtType<N[]> {
    constructor(value: N[]);
    toString(): string;
}
export declare class NbtCompound extends NbtType<{
    [key: string]: NbtType<any>;
}> {
    constructor(value: {
        [key: string]: NbtType<any>;
    });
    toString(): string;
}
export declare class NbtByteArray extends NbtType<NbtByte[]> {
    constructor(value: NbtByte[]);
    toString(): string;
}
export declare class NbtIntArray extends NbtType<NbtInt[]> {
    constructor(value: NbtInt[]);
    toString(): string;
}
export declare class NbtLongArray extends NbtType<NbtLong[]> {
    constructor(value: NbtLong[]);
    toString(): string;
}
export type NbtClass = NbtInt | NbtByte | NbtShort | NbtLong | NbtFloat | NbtDouble | NbtBoolean | NbtString | NbtList<any, NbtType<any>> | NbtCompound | NbtByteArray | NbtIntArray | NbtLongArray;
export {};
