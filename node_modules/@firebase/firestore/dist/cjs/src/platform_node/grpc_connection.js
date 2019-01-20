"use strict";
/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO(dimond): The following imports have been replaced with require
// statements to not let the google closure compiler try to resolve them at
// compile time.
// import * as grpc from 'grpc';
// import * as protobufjs from 'protobufjs';
// import * as util from 'util';
var app_1 = require("@firebase/app");
var SDK_VERSION = app_1.default.SDK_VERSION;
// Trick the TS compiler & Google closure compiler into executing normal require
// statements, not using goog.require to import modules at compile time
var dynamicRequire = require;
var grpc = dynamicRequire('grpc');
var grpcVersion = dynamicRequire('grpc/package.json').version;
var util = dynamicRequire('util');
var stream_bridge_1 = require("../remote/stream_bridge");
var rpc_error_1 = require("../remote/rpc_error");
var assert_1 = require("../util/assert");
var error_1 = require("../util/error");
var log = require("../util/log");
var node_api_1 = require("../util/node_api");
var LOG_TAG = 'Connection';
// TODO(b/38203344): The SDK_VERSION is set independently from Firebase because
// we are doing out-of-band releases. Once we release as part of Firebase, we
// should use the Firebase version instead.
var X_GOOG_API_CLIENT_VALUE = "gl-node/" + process.versions
    .node + " fire/" + SDK_VERSION + " grpc/" + grpcVersion;
function createHeaders(databaseInfo, token) {
    assert_1.assert(token === null || token.type === 'OAuth', 'If provided, token must be OAuth');
    var channelCredentials = databaseInfo.ssl
        ? grpc.credentials.createSsl()
        : grpc.credentials.createInsecure();
    var callCredentials = grpc.credentials.createFromMetadataGenerator(function (context, cb) {
        var metadata = new grpc.Metadata();
        if (token) {
            for (var header in token.authHeaders) {
                if (token.authHeaders.hasOwnProperty(header)) {
                    metadata.set(header, token.authHeaders[header]);
                }
            }
        }
        metadata.set('x-goog-api-client', X_GOOG_API_CLIENT_VALUE);
        // This header is used to improve routing and project isolation by the
        // backend.
        metadata.set('google-cloud-resource-prefix', "projects/" + databaseInfo.databaseId.projectId + "/" +
            ("databases/" + databaseInfo.databaseId.database));
        cb(null, metadata);
    });
    return grpc.credentials.combineChannelCredentials(channelCredentials, callCredentials);
}
/**
 * A Connection implemented by GRPC-Node.
 */
var GrpcConnection = /** @class */ (function () {
    function GrpcConnection(builder, databaseInfo) {
        this.databaseInfo = databaseInfo;
        // We cache stubs for the most-recently-used token.
        this.cachedStub = null;
        var protos = grpc.loadObject(builder.ns);
        this.firestore = protos.google.firestore.v1beta1;
    }
    GrpcConnection.prototype.sameToken = function (tokenA, tokenB) {
        var valueA = tokenA && tokenA.authHeaders['Authorization'];
        var valueB = tokenB && tokenB.authHeaders['Authorization'];
        return valueA === valueB;
    };
    // tslint:disable-next-line:no-any
    GrpcConnection.prototype.getStub = function (token) {
        if (!this.cachedStub || !this.sameToken(this.cachedStub.token, token)) {
            log.debug(LOG_TAG, 'Creating datastore stubs.');
            var credentials = createHeaders(this.databaseInfo, token);
            this.cachedStub = {
                stub: new this.firestore.Firestore(this.databaseInfo.host, credentials),
                token: token
            };
        }
        return this.cachedStub.stub;
    };
    GrpcConnection.prototype.invoke = function (rpcName, request, token) {
        var stub = this.getStub(token);
        return node_api_1.nodePromise(function (callback) {
            return stub[rpcName](request, function (grpcError, value) {
                if (grpcError) {
                    log.debug(LOG_TAG, 'RPC "' +
                        rpcName +
                        '" failed with error ' +
                        JSON.stringify(grpcError));
                    callback(new error_1.FirestoreError(rpc_error_1.mapCodeFromRpcCode(grpcError.code), grpcError.message));
                }
                else {
                    callback(undefined, value);
                }
            });
        });
    };
    // TODO(mikelehen): This "method" is a monster. Should be refactored.
    GrpcConnection.prototype.openStream = function (rpcName, token) {
        var stub = this.getStub(token);
        var grpcStream = stub[rpcName]();
        var closed = false;
        var close;
        var remoteEnded = false;
        var stream = new stream_bridge_1.StreamBridge({
            sendFn: function (msg) {
                if (!closed) {
                    log.debug(LOG_TAG, 'GRPC stream sending:', util.inspect(msg, { depth: 100 }));
                    try {
                        grpcStream.write(msg);
                    }
                    catch (e) {
                        // This probably means we didn't conform to the proto.  Make sure to
                        // log the message we sent.
                        log.error(LOG_TAG, 'Failure sending: ', util.inspect(msg, { depth: 100 }));
                        log.error(LOG_TAG, 'Error: ', e);
                        throw e;
                    }
                }
                else {
                    log.debug(LOG_TAG, 'Not sending because gRPC stream is closed:', util.inspect(msg, { depth: 100 }));
                }
            },
            closeFn: function () {
                close();
            }
        });
        close = function (err) {
            if (!closed) {
                closed = true;
                stream.callOnClose(err);
                grpcStream.end();
            }
        };
        grpcStream.on('data', function (msg) {
            if (!closed) {
                log.debug(LOG_TAG, 'GRPC stream received: ', util.inspect(msg, { depth: 100 }));
                stream.callOnMessage(msg);
            }
        });
        grpcStream.on('end', function () {
            log.debug(LOG_TAG, 'GRPC stream ended.');
            // The server closed the remote end.  Close our side too (which will
            // trigger the 'finish' event).
            remoteEnded = true;
            grpcStream.end();
        });
        grpcStream.on('finish', function () {
            // This means we've closed the write side of the stream.  We either did
            // this because the StreamBridge was close()ed or because we got an 'end'
            // event from the grpcStream.
            // TODO(mikelehen): This is a hack because of weird grpc-node behavior
            // (https://github.com/grpc/grpc/issues/7705).  The stream may be finished
            // because we called end() because we got an 'end' event because there was
            // an error.  Now that we've called end(), GRPC should deliver the error,
            // but it may take some time (e.g. 700ms). So we delay our close handling
            // in case we receive such an error.
            if (remoteEnded) {
                setTimeout(close, 2500);
            }
            else {
                close();
            }
        });
        grpcStream.on('error', function (grpcError) {
            log.debug(LOG_TAG, 'GRPC stream error:', grpcError);
            var code = rpc_error_1.mapCodeFromRpcCode(grpcError.code);
            close(new error_1.FirestoreError(code, grpcError.message));
        });
        grpcStream.on('status', function (status) {
            if (!closed) {
                log.debug(LOG_TAG, 'GRPC stream received status:', status);
                if (status.code === 0) {
                    // all good
                }
                else {
                    var code = rpc_error_1.mapCodeFromRpcCode(status.code);
                    close(new error_1.FirestoreError(code, status.details));
                }
            }
        });
        log.debug(LOG_TAG, 'Opening GRPC stream');
        // TODO(dimond): Since grpc has no explicit open status (or does it?) we
        // simulate an onOpen in the next loop after the stream had it's listeners
        // registered
        setTimeout(function () {
            stream.callOnOpen();
        }, 0);
        return stream;
    };
    return GrpcConnection;
}());
exports.GrpcConnection = GrpcConnection;

//# sourceMappingURL=grpc_connection.js.map
