import { NbtByte, NbtByteArray, NbtCompound, NbtDouble, NbtFloat, NbtInt, NbtIntArray, NbtList, NbtLong, NbtLongArray, NbtShort, NbtString } from './NbtType.js';
function nbtDataKeyParser(str) {
    const startLength = str.search(/\S/);
    if (startLength === -1) {
        throw new Error('Key not found.');
    }
    const firstStr = str[startLength];
    for (let i = startLength + 1; i < str.length; i += 1) {
        if (firstStr === '"' && str[i] === '\\') {
            i += 1;
            continue;
        }
        if (str[i] === '"') {
            if (firstStr === '"') {
                const colonPos = str.indexOf(':', i + 1);
                if (colonPos === -1) {
                    throw new Error('Key end not found.');
                }
                // Success only if the interval is blank or line break
                if (/^\s*$/.test(str.slice(i + 1, colonPos))) {
                    return {
                        unParsedStr: str.slice(colonPos + 1),
                        parsedData: str.slice(startLength + 1, i),
                        usedLength: colonPos + 1
                    };
                }
            }
            throw new Error('Unexpected character " found.');
        }
        if (str[i] === ':' && firstStr !== '"') {
            return {
                unParsedStr: str.slice(i + 1),
                parsedData: str.slice(startLength, i),
                usedLength: i + 1
            };
        }
    }
    throw new Error('Key end not found.');
}
function parseNbtData(str, startLength, i, isAlphabet, NbtType) {
    const len = i + (isAlphabet ? 1 : 0);
    return {
        unParsedStr: str.slice(len),
        parsedData: new NbtType(Number(str.slice(startLength, i))),
        usedLength: len
    };
}
function determineValueType(str, i, specifyType) {
    const typeChar = str[i].toLowerCase();
    const typeMap = {
        d: NbtDouble,
        b: NbtByte,
        s: NbtShort,
        f: NbtFloat,
        l: NbtLong
    };
    const specifyTypeChar = typeMap[typeChar] ?? null;
    if (specifyType !== null) {
        if (specifyTypeChar !== null && specifyType !== specifyTypeChar) {
            throw new Error('Value type mismatch.');
        }
    }
    return specifyTypeChar ?? specifyType ?? NbtInt;
}
function nbtDataValueParser(str, specifyType) {
    const startLength = str.search(/\S/);
    if (startLength === -1) {
        throw new Error('Key not found.');
    }
    const firstStr = str[startLength];
    if (firstStr === '"') {
        for (let i = startLength + 1; i < str.length; i += 1) {
            if (str[i] === '"') {
                return {
                    unParsedStr: str.slice(i + 1),
                    parsedData: new NbtString(str.slice(startLength + 1, i)),
                    usedLength: i + 1
                };
            }
            else if (str[i] === '\\') {
                i += 1;
            }
        }
        throw new Error('String end not found.');
    }
    if (firstStr === '{') {
        return nbtDataObjectParser(str);
    }
    if (firstStr === '[') {
        return nbtDataArrayParser(str);
    }
    if (firstStr.match(/^[0-9-]$/) != null) {
        for (let i = startLength + 1; i < str.length; i += 1) {
            if (str[i].match(/^[0-9.]$/) != null) {
                continue;
            }
            const determinedType = determineValueType(str, i, specifyType);
            const isAlphabet = str[i].match(/^[a-z]$/i) != null;
            return parseNbtData(str, startLength, i, isAlphabet, determinedType);
        }
    }
    throw new Error('Value type not found.' + str);
}
function nbtDataArrayParser(str) {
    const startLength = str.search(/\S/);
    if (startLength === -1) {
        throw new Error('Key not found.');
    }
    const firstStr = str[startLength];
    if (firstStr !== '[') {
        throw new Error('Array element not found.');
    }
    const listType = [
        { type: NbtByte, TypeArray: NbtByteArray, prefix: '[B;' },
        { type: NbtInt, TypeArray: NbtIntArray, prefix: '[I;' },
        { type: NbtLong, TypeArray: NbtLongArray, prefix: '[L;' },
        { type: undefined, TypeArray: NbtList, prefix: '[' }
    ].find(v => str.slice(startLength, startLength + v.prefix.length) === v.prefix);
    if (listType === undefined) {
        throw new Error('Array type not found.');
    }
    const firstLength = startLength + (listType.prefix.length);
    const arr = [];
    let value = undefined;
    // console.log('parser start.', str, firstLength)
    for (let i = firstLength; i < str.length; i += 1) {
        if (str[i] === ' ' || str[i] === '\n') {
            continue;
        }
        if (str[i] === ',') {
            if (value !== undefined) {
                arr.push(value);
                value = undefined;
            }
            else {
                console.log('Value not found.' + str.slice(i));
            }
            continue;
        }
        if (str[i] === ']') {
            if (value !== undefined) {
                arr.push(value);
            }
            return {
                unParsedStr: str.slice(i + 1),
                parsedData: new listType.TypeArray(arr),
                usedLength: i + 1
            };
        }
        const result = nbtDataValueParser(str.slice(i), listType.type ?? null);
        // console.log(result, i)
        value = result.parsedData;
        i += result.usedLength - 1;
    }
    throw new Error('Array end not found.');
}
function nbtDataObjectParser(str) {
    const startLength = str.search(/\S/);
    if (startLength === -1) {
        throw new Error('Key not found.');
    }
    const firstStr = str[startLength];
    if (firstStr !== '{') {
        throw new Error('Object element not found.');
    }
    const obj = {};
    let key = '';
    let value = undefined;
    let checkType = 'key';
    for (let i = startLength + 1; i < str.length; i += 1) {
        const char = str[i];
        if (char === '}') {
            if (checkType === 'valueEnd') {
                obj[key] = value;
            }
            else if (checkType === 'value') {
                throw new Error('Unexpected character } found.');
            }
            return {
                unParsedStr: str.slice(i + 1),
                parsedData: new NbtCompound(obj),
                usedLength: i + 1
            };
        }
        if (checkType === 'key') {
            const result = nbtDataKeyParser(str.slice(i));
            key = result.parsedData;
            i += result.usedLength - 1;
            checkType = 'value';
            continue;
        }
        if (checkType === 'value') {
            const result = nbtDataValueParser(str.slice(i), null);
            value = result.parsedData;
            i += result.usedLength - 1;
            checkType = 'valueEnd';
            continue;
        }
        if (checkType === 'valueEnd') {
            if (char === ',') {
                obj[key] = value;
                key = '';
                value = undefined;
                checkType = 'key';
                continue;
            }
        }
    }
    throw new Error('Object end not found.');
}
/**
 * parse NBT data.
 * @param str NBT data
 * @returns parsed result
 */
export function nbtDataParser(str) {
    const firstStr = str[0];
    if (!(firstStr === '{' || firstStr === '[')) {
        return nbtDataValueParser(str, null).parsedData;
    }
    const result = firstStr === '{' ? nbtDataObjectParser(str) : nbtDataArrayParser(str);
    return result.parsedData;
}
export const _test_ = {
    nbtDataKeyParser,
    nbtDataValueParser,
    nbtDataArrayParser,
    nbtDataObjectParser
};
//# sourceMappingURL=parser.js.map