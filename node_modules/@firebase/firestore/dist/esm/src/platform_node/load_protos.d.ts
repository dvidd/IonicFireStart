export declare type ProtobufProtoBuilder = any;
import { NodeCallback } from '../util/node_api';
export declare function loadProtosAsync(): Promise<ProtobufProtoBuilder>;
/**
 * Loads the protocol buffer definitions for the datastore. This is a thin
 * wrapper around protobufjs.loadProtoFile which knows the location of the
 * proto files.
 *
 * @param callback if specified, the load is performed asynchronously and
 *     the protos are supplied to the callback.
 * @returns the ProtoBuilder if the callback is unspecified.
 */
export declare function loadProtos(callback?: NodeCallback<ProtobufProtoBuilder>): ProtobufProtoBuilder | undefined;
