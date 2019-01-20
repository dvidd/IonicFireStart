export declare type GrpcMetadataCallback = any;
import { Token } from '../api/credentials';
import { DatabaseInfo } from '../core/database_info';
import { Connection, Stream } from '../remote/connection';
import { ProtobufProtoBuilder } from './load_protos';
/**
 * A Connection implemented by GRPC-Node.
 */
export declare class GrpcConnection implements Connection {
    private databaseInfo;
    private firestore;
    private cachedStub;
    constructor(builder: ProtobufProtoBuilder, databaseInfo: DatabaseInfo);
    private sameToken(tokenA, tokenB);
    private getStub(token);
    invoke(rpcName: string, request: any, token: Token | null): Promise<any>;
    openStream(rpcName: string, token: Token | null): Stream<any, any>;
}
