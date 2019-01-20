export declare function findClosestOpenPorts(host: string, ports: number[]): Promise<number[]>;
export declare function findClosestOpenPort(host: string, port: number): Promise<number>;
export declare function isPortTaken(host: string, port: number): Promise<boolean>;
