var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject, Optional, NgZone, PLATFORM_ID } from '@angular/core';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, RealtimeDatabaseURL, _firebaseAppFactory, FirebaseZoneScheduler } from '@angular/fire';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(options, nameOrConfig, databaseURL, platformId, zone) {
        this.scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.database = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(options, nameOrConfig);
            return app.database(databaseURL || undefined);
        });
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, queryFn) {
        var ref = getRef(this.database, pathOrRef);
        var query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query, this);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef) {
        var ref = getRef(this.database, pathOrRef);
        return createObjectReference(ref, this);
    };
    AngularFireDatabase.prototype.createPushId = function () {
        return this.database.ref().push().key;
    };
    AngularFireDatabase = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Optional()), __param(2, Inject(RealtimeDatabaseURL)),
        __param(3, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [Object, Object, String, Object,
            NgZone])
    ], AngularFireDatabase);
    return AngularFireDatabase;
}());
export { AngularFireDatabase };
export { RealtimeDatabaseURL };
//# sourceMappingURL=database.js.map