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
import { Inject, Injectable, Optional, NgZone } from '@angular/core';
import { FirebaseListFactory } from './firebase_list_factory';
import { FirebaseObjectFactory } from './firebase_object_factory';
import * as utils from './utils';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, RealtimeDatabaseURL, _firebaseAppFactory } from '@angular/fire';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(options, nameOrConfig, databaseURL, zone) {
        this.database = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(options, nameOrConfig);
            return app.database(databaseURL || undefined);
        });
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, opts) {
        var ref = utils.getRef(this.database, pathOrRef);
        return FirebaseListFactory(ref, opts);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef, opts) {
        var ref = utils.getRef(this.database, pathOrRef);
        return FirebaseObjectFactory(ref, opts);
    };
    AngularFireDatabase = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Optional()), __param(2, Inject(RealtimeDatabaseURL)),
        __metadata("design:paramtypes", [Object, Object, String, NgZone])
    ], AngularFireDatabase);
    return AngularFireDatabase;
}());
export { AngularFireDatabase };
export { RealtimeDatabaseURL };
//# sourceMappingURL=database.js.map