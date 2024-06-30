abstract class NbtType<T> {
  protected data: T
  protected type: string
  constructor (value: T, type: string) {
    this.data = value
    this.type = type
  }

  get (): T {
    return this.data
  }

  value (): T {
    return this.data
  }

  getType (): string {
    return this.type
  }

  set (value: T): void {
    this.data = value
  }

  abstract toString (): string
}

abstract class NbtNumber extends NbtType<number> {
  abstract add (value: NbtNumber): NbtNumber
  abstract sub (value: NbtNumber): NbtNumber
  abstract mul (value: NbtNumber): NbtNumber
  abstract div (value: NbtNumber): NbtNumber
}

export class NbtInt extends NbtNumber {
  private static adjustValue (value: number): number {
    value = Math.round(value)
    return value % 0x80000000
  }

  constructor (value: number) {
    super(NbtInt.adjustValue(value), 'int')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtInt(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtInt(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtInt(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtInt(this.get() / value.get())
  }

  toString (): string {
    return `${this.data}`
  }
}

export class NbtByte extends NbtNumber {
  private static adjustValue (value: number): number {
    value = Math.round(value)
    return value % 0x80
  }

  constructor (value: number) {
    super(NbtByte.adjustValue(value), 'byte')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtByte(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtByte(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtByte(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtByte(this.get() / value.get())
  }

  toString (): string {
    return `${this.data}b`
  }
}

export class NbtShort extends NbtNumber {
  private static adjustValue (value: number): number {
    value = Math.round(value)
    return value % 0x8000
  }

  constructor (value: number) {
    super(NbtShort.adjustValue(value), 'short')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtShort(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtShort(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtShort(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtShort(this.get() / value.get())
  }

  toString (): string {
    return `${this.data}s`
  }
}

export class NbtLong extends NbtNumber {
  private static adjustValue (value: number): number {
    value = Math.round(value)
    return value % 0x8000000000000000
  }

  constructor (value: number) {
    super(NbtLong.adjustValue(value), 'long')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtLong(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtLong(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtLong(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtLong(this.get() / value.get())
  }

  toString (): string {
    return `${this.data}l`
  }
}

export class NbtFloat extends NbtNumber {
  private static adjustValue (value: number): number {
    const float32Array = new Float32Array(1)
    float32Array[0] = value
    return float32Array[0]
  }

  constructor (value: number) {
    super(NbtFloat.adjustValue(value), 'float')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtFloat(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtFloat(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtFloat(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtFloat(this.get() / value.get())
  }

  toString (): string {
    return `${this.data % 1 === 0 ? this.data.toFixed(1) : this.data}f`
  }
}

export class NbtDouble extends NbtNumber {
  private static adjustValue (value: number): number {
    const float64Array = new Float64Array(1)
    float64Array[0] = value
    return float64Array[0]
  }

  constructor (value: number) {
    super(NbtDouble.adjustValue(value), 'double')
  }

  add (value: NbtNumber): NbtNumber {
    return new NbtDouble(this.get() + value.get())
  }

  sub (value: NbtNumber): NbtNumber {
    return new NbtDouble(this.get() - value.get())
  }

  mul (value: NbtNumber): NbtNumber {
    return new NbtDouble(this.get() * value.get())
  }

  div (value: NbtNumber): NbtNumber {
    return new NbtDouble(this.get() / value.get())
  }

  toString (): string {
    return `${this.data % 1 === 0 ? this.data.toFixed(1) : this.data}d`
  }
}

export class NbtBoolean extends NbtType<boolean> {
  constructor (value: boolean) {
    super(value, 'boolean')
  }

  toString (): string {
    return this.data ? 'true' : 'false'
  }
}

export class NbtString extends NbtType<string> {
  constructor (value: string) {
    super(value, 'string')
  }

  toString (): string {
    return `"${this.data}"`
  }
}

export class NbtList<T, N extends NbtType<T>> extends NbtType<N[]> {
  constructor (value: N[]) {
    super(value, 'list')
  }

  toString (): string {
    return `[${this.data.map(item => item.toString()).join(', ')}]`
  }
}

export class NbtCompound extends NbtType<{ [key: string]: NbtType<any> }> {
  constructor (value: { [key: string]: NbtType<any> }) {
    super(value, 'compound')
  }

  toString (): string {
    return `{${Object.entries(this.data)
      .map(([key, value]) => `${key}: ${value.toString()}`)
      .join(', ')}}`
  }
}

export class NbtByteArray extends NbtType<NbtByte[]> {
  constructor (value: NbtByte[]) {
    super(value, 'byteArray')
  }

  toString (): string {
    return `[B; ${this.data.map(item => item.toString()).join(', ')}]`
  }
}

export class NbtIntArray extends NbtType<NbtInt[]> {
  constructor (value: NbtInt[]) {
    super(value, 'intArray')
  }

  toString (): string {
    return `[I; ${this.data.map(item => item.toString()).join(', ')}]`
  }
}

export class NbtLongArray extends NbtType<NbtLong[]> {
  constructor (value: NbtLong[]) {
    super(value, 'longArray')
  }

  toString (): string {
    return `[L; ${this.data.map(item => item.toString()).join(', ')}]`
  }
}

export type NbtClass = NbtInt | NbtByte | NbtShort | NbtLong | NbtFloat | NbtDouble | NbtBoolean | NbtString | NbtList<any, NbtType<any>> | NbtCompound | NbtByteArray | NbtIntArray | NbtLongArray
