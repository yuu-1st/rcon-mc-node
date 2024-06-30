import Rcon from 'rcon';
import AsyncLock from 'async-lock';
const lock = new AsyncLock();
let instanceCount = 0;
export class RconWrapper {
    rcon;
    instanceId = instanceCount++;
    receiveResponse = null;
    async useReceiveResponse(execute) {
        const result = await lock.acquire(`rcon-${this.instanceId}`, async () => {
            const response = new Promise((resolve, reject) => {
                this.receiveResponse = (str) => {
                    if (str instanceof Error) {
                        reject(str);
                    }
                    else {
                        resolve(str);
                    }
                };
            });
            await execute();
            return await response;
        });
        if (result instanceof Error) {
            throw result;
        }
        return result;
    }
    /**
     * constructor
     * @param host minecraft server host
     * @param port rcon port
     * @param password rcon password
     */
    constructor(host, port, password) {
        this.rcon = new Rcon(host, port, password, {
            tcp: true,
            challenge: false
        });
        this.rcon
            .on('auth', () => {
            if (this.receiveResponse !== null) {
                this.receiveResponse('Authenticated');
                this.receiveResponse = null;
            }
            else {
                console.log('receiveResponse is null. : Authenticated');
            }
        })
            .on('response', (str) => {
            if (this.receiveResponse !== null) {
                this.receiveResponse(str);
                this.receiveResponse = null;
            }
            else {
                console.log('receiveResponse is null. : Response: ' + str);
            }
        })
            .on('error', (err) => {
            if (this.receiveResponse !== null) {
                this.receiveResponse(err);
                this.receiveResponse = null;
            }
            else {
                console.log('receiveResponse is null. : Error: ' + err.message);
            }
        })
            .on('end', () => {
            if (this.receiveResponse !== null) {
                this.receiveResponse('Connection closed');
                this.receiveResponse = null;
            }
            else {
                console.log('receiveResponse is null. : Connection closed');
            }
        });
    }
    /**
     * connect to minecraft server
     */
    async connect() {
        await this.useReceiveResponse(async () => {
            await this.rcon.connect();
        });
    }
    /**
     * disconnect from minecraft server
     */
    async disconnect() {
        await this.useReceiveResponse(async () => {
            await this.rcon.disconnect();
        });
    }
    /**
     * send command to minecraft server
     * @param data command
     * @returns response
     * @throws Error if not authenticated
     */
    async send(data) {
        if (!this.rcon.hasAuthed) {
            throw new Error('Not authenticated');
        }
        return await this.useReceiveResponse(async () => {
            await this.rcon.send(data);
        });
    }
}
//# sourceMappingURL=RconWrapper.js.map