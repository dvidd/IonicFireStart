export declare class Api {
    url: string;
    constructor(url: string);
    post(endpoint: string, data: any): Promise<{}>;
}
