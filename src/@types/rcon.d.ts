declare module 'rcon' {
  import { EventEmitter } from 'events'

  interface RconOptions {
    id?: number
    tcp?: boolean
    challenge?: boolean
  }

  export default class Rcon extends EventEmitter {
    host: string
    port: number
    password: string
    rconId: number
    hasAuthed: boolean
    outstandingData: any
    tcp: boolean
    challenge: boolean

    constructor (host: string, port: number, password: string, options?: RconOptions)
    connect (): Promise<void>
    send (data: string, cmd?: number, id?: number): Promise<string>
    disconnect (): Promise<void>
    socketOnConnect (): void
    socketOnEnd (): void
  }
}
