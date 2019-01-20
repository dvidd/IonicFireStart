import { Token } from '../api/credentials';
import { DatabaseInfo } from '../core/database_info';
import { Connection, Stream } from '../remote/connection';
export declare class WebChannelConnection implements Connection {
    private readonly databaseId;
    private readonly baseUrl;
    private readonly pool;
    /**
     * Mapping from RPC name to service providing the RPC.
     * For streaming RPCs only.
     */
    private static RPC_STREAM_SERVICE_MAPPING;
    /**
     * Mapping from RPC name to actual RPC name in URLs.
     * For streaming RPCs only.
     */
    private static RPC_STREAM_NAME_MAPPING;
    constructor(info: DatabaseInfo);
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    private modifyHeadersForRequest(headers, token);
    invoke(rpcName: string, request: any, token: Token | null): Promise<any>;
    openStream(rpcName: string, token: Token | null): Stream<any, any>;
    makeUrl(rpcName: string): string;
}
