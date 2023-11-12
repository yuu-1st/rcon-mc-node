interface ParserReturn<T> {
  unParsedStr: string
  parsedData: T
  usedLength: number
}

type ValueType = string | number | object | unknown[]

function nbtDataKeyParser (str: string): ParserReturn<string> {
  const startLength = str.search(/\S/)
  if (startLength === -1) {
    throw new Error('Key not found.')
  }
  const firstStr = str[startLength]
  for (let i = startLength + 1; i < str.length; i += 1) {
    if (firstStr === '"' && str[i] === '\\') {
      i += 1
      continue
    }
    if (str[i] === '"') {
      if (firstStr === '"') {
        const colonPos = str.indexOf(':', i + 1)
        if (colonPos === -1) {
          throw new Error('Key end not found.')
        }
        // Success only if the interval is blank or line break
        if (/^\s*$/.test(str.slice(i + 1, colonPos))) {
          return {
            unParsedStr: str.slice(colonPos + 1),
            parsedData: str.slice(startLength + 1, i),
            usedLength: colonPos + 1
          }
        }
      }
      throw new Error('Unexpected character " found.')
    }
    if (str[i] === ':' && firstStr !== '"') {
      return {
        unParsedStr: str.slice(i + 1),
        parsedData: str.slice(startLength, i),
        usedLength: i + 1
      }
    }
  }
  throw new Error('Key end not found.')
}

function nbtDataValueParser (str: string): ParserReturn<ValueType> {
  const startLength = str.search(/\S/)
  if (startLength === -1) {
    throw new Error('Key not found.')
  }
  const firstStr = str[startLength]

  if (firstStr === '"') {
    for (let i = startLength + 1; i < str.length; i += 1) {
      if (str[i] === '"') {
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: str.slice(startLength + 1, i),
          usedLength: i + 1
        }
      } else if (str[i] === '\\') {
        i += 1
      }
    }
    throw new Error('String end not found.')
  }
  if (firstStr === '{') {
    return nbtDataObjectParser(str)
  }
  if (firstStr === '[') {
    return nbtDataArrayParser(str)
  }
  if (firstStr.match(/^[0-9-]$/) != null) {
    for (let i = startLength + 1; i < str.length; i += 1) {
      if (str[i].match(/^[0-9.]$/) != null) {
        continue
      }
      if (str[i] === 'd' || str[i] === 'D') {
        // double
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: Number(str.slice(startLength, i)),
          usedLength: i + 1
        }
      }
      if (str[i] === 'b' || str[i] === 'B') {
        // 8bit. -128 ~ 127
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: Number(str.slice(startLength, i)),
          usedLength: i + 1
        }
      }
      if (str[i] === 's' || str[i] === 'S') {
        // short. -32768 ~ 32767
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: Number(str.slice(startLength, i)),
          usedLength: i + 1
        }
      }
      if (str[i] === 'f' || str[i] === 'F') {
        // float
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: Number(str.slice(startLength, i)),
          usedLength: i + 1
        }
      }
      if (str[i] === 'l' || str[i] === 'L') {
        // long
        return {
          unParsedStr: str.slice(i + 1),
          parsedData: Number(str.slice(startLength, i)),
          usedLength: i + 1
        }
      }
      return {
        unParsedStr: str.slice(i),
        parsedData: Number(str.slice(startLength, i)),
        usedLength: i
      }
    }
  }
  throw new Error('Value type not found.' + str)
}

function nbtDataArrayParser (str: string): ParserReturn<unknown[]> {
  const startLength = str.search(/\S/)
  if (startLength === -1) {
    throw new Error('Key not found.')
  }
  const firstStr = str[startLength]
  if (firstStr !== '[') {
    throw new Error('Array element not found.')
  }
  const firstLength =
    startLength +
    (['[B;', '[I;', '[L;'].findIndex(
      v => str.slice(startLength, startLength + v.length) === v
    ) !== -1
      ? 3
      : 1)
  const arr: unknown[] = []
  let value: ValueType = ''
  for (let i = firstLength; i < str.length; i += 1) {
    if (str[i] === ' ' || str[i] === '\n') {
      continue
    }
    if (str[i] === ',') {
      if (value !== '') {
        arr.push(value)
        value = ''
      }
      continue
    }
    if (str[i] === ']') {
      if (value !== '') {
        arr.push(value)
      }
      return {
        unParsedStr: str.slice(i + 1),
        parsedData: arr,
        usedLength: i + 1
      }
    }
    const result = nbtDataValueParser(str.slice(i))
    value = result.parsedData
    i += result.usedLength - 1
  }
  throw new Error('Array end not found.')
}

function nbtDataObjectParser (str: string): ParserReturn<object> {
  const startLength = str.search(/\S/)
  if (startLength === -1) {
    throw new Error('Key not found.')
  }
  const firstStr = str[startLength]
  if (firstStr !== '{') {
    throw new Error('Object element not found.')
  }
  const obj: { [key: string]: ValueType } = {}
  let key = ''
  let value: ValueType = ''
  let checkType: 'key' | 'value' | 'valueEnd' = 'key'
  for (let i = startLength + 1; i < str.length; i += 1) {
    const char = str[i]
    if (char === '}') {
      if (checkType === 'valueEnd') {
        obj[key] = value
      } else if (checkType === 'value') {
        throw new Error('Unexpected character } found.')
      }
      return {
        unParsedStr: str.slice(i + 1),
        parsedData: obj,
        usedLength: i + 1
      }
    }
    if (checkType === 'key') {
      const result = nbtDataKeyParser(str.slice(i))
      key = result.parsedData
      i += result.usedLength - 1
      checkType = 'value'
      continue
    }
    if (checkType === 'value') {
      const result = nbtDataValueParser(str.slice(i))
      value = result.parsedData
      i += result.usedLength - 1
      checkType = 'valueEnd'
      continue
    }
    if (checkType === 'valueEnd') {
      if (char === ',') {
        obj[key] = value
        key = ''
        value = ''
        checkType = 'key'
        continue
      }
    }
  }
  throw new Error('Object end not found.')
}

/**
 * parse NBT data.
 * @param str NBT data
 * @returns parsed result
 */
export function nbtDataParser (str: string): ValueType {
  const firstStr = str[0]
  if (!(firstStr === '{' || firstStr === '[')) {
    return nbtDataValueParser(str).parsedData
  }
  const result =
    firstStr === '{' ? nbtDataObjectParser(str) : nbtDataArrayParser(str)
  return result.parsedData
}

export const _test_ = {
  nbtDataKeyParser,
  nbtDataValueParser,
  nbtDataArrayParser,
  nbtDataObjectParser
}
