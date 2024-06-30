import { NbtByte, NbtByteArray, NbtClass, NbtCompound, NbtDouble, NbtFloat, NbtInt, NbtIntArray, NbtList, NbtLong, NbtLongArray, NbtShort } from './NbtType.js';
interface ParserReturn<T extends NbtClass> {
    unParsedStr: string;
    parsedData: T;
    usedLength: number;
}
interface ParserKeyReturn {
    unParsedStr: string;
    parsedData: string;
    usedLength: number;
}
export type ValueType = string | object | unknown[];
declare function nbtDataKeyParser(str: string): ParserKeyReturn;
type NbtDataValueType = typeof NbtByte | typeof NbtShort | typeof NbtInt | typeof NbtLong | typeof NbtFloat | typeof NbtDouble;
declare function nbtDataValueParser(str: string, specifyType: NbtDataValueType | null): ParserReturn<NbtClass>;
declare function nbtDataArrayParser(str: string): ParserReturn<NbtList<any, NbtClass> | NbtByteArray | NbtIntArray | NbtLongArray>;
declare function nbtDataObjectParser(str: string): ParserReturn<NbtCompound>;
/**
 * parse NBT data.
 * @param str NBT data
 * @returns parsed result
 */
export declare function nbtDataParser(str: string): NbtClass;
export declare const _test_: {
    nbtDataKeyParser: typeof nbtDataKeyParser;
    nbtDataValueParser: typeof nbtDataValueParser;
    nbtDataArrayParser: typeof nbtDataArrayParser;
    nbtDataObjectParser: typeof nbtDataObjectParser;
};
export {};
