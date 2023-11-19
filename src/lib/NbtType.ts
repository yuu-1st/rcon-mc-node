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

abstract class NbtNumber<T> extends NbtType<T> {}

export class NbtInt extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'int')
  }

  toString (): string {
    return `${this.data}`
  }
}

export class NbtByte extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'byte')
  }

  toString (): string {
    return `${this.data}b`
  }
}

export class NbtShort extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'short')
  }

  toString (): string {
    return `${this.data}s`
  }
}

export class NbtLong extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'long')
  }

  toString (): string {
    return `${this.data}l`
  }
}

export class NbtFloat extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'float')
  }

  toString (): string {
    return `${this.data}f`
  }
}

export class NbtDouble extends NbtNumber<number> {
  constructor (value: number) {
    super(value, 'double')
  }

  toString (): string {
    return `${this.data}d`
  }
}
