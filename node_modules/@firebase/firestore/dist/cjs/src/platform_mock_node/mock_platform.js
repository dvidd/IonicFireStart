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
var serializer_1 = require("../remote/serializer");
var assert_1 = require("../util/assert");
var error_1 = require("../util/error");
var MockPlatform = /** @class */ (function () {
    function MockPlatform() {
        /** A "mock" platform for use in NodeJS unit tests since we can't depend on
         * gRPC. */
        this.base64Available = true;
        this.emptyByteString = new Uint8Array(0);
    }
    MockPlatform.prototype.loadConnection = function (databaseInfo) {
        return assert_1.fail('loadConnection() not supported in unit tests.');
    };
    MockPlatform.prototype.newSerializer = function (databaseId) {
        return new serializer_1.JsonProtoSerializer(databaseId, { useProto3Json: false });
    };
    MockPlatform.prototype.atob = function (encoded) {
        // Node actually doesn't validate base64 strings.
        // A quick sanity check that is not a fool-proof validation
        if (/[^-A-Za-z0-9+/=]/.test(encoded)) {
            throw new error_1.FirestoreError(error_1.Code.INVALID_ARGUMENT, 'Not a valid Base64 string: ' + encoded);
        }
        return new Buffer(encoded, 'base64').toString('binary');
    };
    MockPlatform.prototype.btoa = function (raw) {
        return new Buffer(raw, 'binary').toString('base64');
    };
    return MockPlatform;
}());
exports.MockPlatform = MockPlatform;

//# sourceMappingURL=mock_platform.js.map
