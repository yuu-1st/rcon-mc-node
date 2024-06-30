export declare class RconWrapper {
    private readonly rcon;
    private readonly instanceId;
    private receiveResponse;
    private useReceiveResponse;
    /**
     * constructor
     * @param host minecraft server host
     * @param port rcon port
     * @param password rcon password
     */
    constructor(host: string, port: number, password: string);
    /**
     * connect to minecraft server
     */
    connect(): Promise<void>;
    /**
     * disconnect from minecraft server
     */
    disconnect(): Promise<void>;
    /**
     * send command to minecraft server
     * @param data command
     * @returns response
     * @throws Error if not authenticated
     */
    send(data: string): Promise<string>;
}
