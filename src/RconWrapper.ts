import Rcon from 'rcon'
import AsyncLock from 'async-lock'

const lock = new AsyncLock()
let instanceCount = 0

export class RconWrapper {
  private readonly rcon: Rcon

  private readonly instanceId: number = instanceCount++

  private receiveResponse: ((str: string | Error) => void) | null = null

  private async useReceiveResponse (execute: () => Promise<void>): Promise<string> {
    const result = await lock.acquire(`rcon-${this.instanceId}`, async () => {
      const response = new Promise<string | Error>((resolve, reject) => {
        this.receiveResponse = (str: string | Error) => {
          if (str instanceof Error) {
            reject(str)
          } else {
            resolve(str)
          }
        }
      })
      await execute()
      return await response
    })
    if (result instanceof Error) {
      throw result
    }
    return result
  }

  /**
   * constructor
   * @param host minecraft server host
   * @param port rcon port
   * @param password rcon password
   */
  constructor (host: string, port: number, password: string) {
    this.rcon = new Rcon(host, port, password, {
      tcp: true,
      challenge: false
    })

    this.rcon
      .on('auth', () => {
        if (this.receiveResponse !== null) {
          this.receiveResponse('Authenticated')
          this.receiveResponse = null
        } else {
          console.log('receiveResponse is null. : Authenticated')
        }
      })
      .on('response', (str: string) => {
        if (this.receiveResponse !== null) {
          this.receiveResponse(str)
          this.receiveResponse = null
        } else {
          console.log('receiveResponse is null. : Response: ' + str)
        }
      })
      .on('error', (err: Error) => {
        if (this.receiveResponse !== null) {
          this.receiveResponse(err)
          this.receiveResponse = null
        } else {
          console.log('receiveResponse is null. : Error: ' + err.message)
        }
      })
      .on('end', () => {
        if (this.receiveResponse !== null) {
          this.receiveResponse('Connection closed')
          this.receiveResponse = null
        } else {
          console.log('receiveResponse is null. : Connection closed')
        }
      })
  }

  /**
   * connect to minecraft server
   */
  async connect (): Promise<void> {
    await this.useReceiveResponse(async () => {
      await this.rcon.connect()
    })
  }

  /**
   * disconnect from minecraft server
   */
  async disconnect (): Promise<void> {
    await this.useReceiveResponse(async () => {
      await this.rcon.disconnect()
    })
  }

  /**
   * send command to minecraft server
   * @param data command
   * @returns response
   * @throws Error if not authenticated
   */
  async send (data: string): Promise<string> {
    if (!this.rcon.hasAuthed) {
      throw new Error('Not authenticated')
    }
    return await this.useReceiveResponse(async () => {
      await this.rcon.send(data)
    })
  }
}
