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
import { Injectable, Inject, Optional, InjectionToken, NgZone, PLATFORM_ID } from '@angular/core';
import { createStorageRef } from './ref';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, FirebaseZoneScheduler, _firebaseAppFactory } from '@angular/fire';
export var StorageBucket = new InjectionToken('angularfire2.storageBucket');
var AngularFireStorage = (function () {
    function AngularFireStorage(options, nameOrConfig, storageBucket, platformId, zone) {
        this.scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.storage = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(options, nameOrConfig);
            return app.storage(storageBucket || undefined);
        });
    }
    AngularFireStorage.prototype.ref = function (path) {
        return createStorageRef(this.storage.ref(path), this.scheduler);
    };
    AngularFireStorage.prototype.upload = function (path, data, metadata) {
        var storageRef = this.storage.ref(path);
        var ref = createStorageRef(storageRef, this.scheduler);
        return ref.put(data, metadata);
    };
    AngularFireStorage = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Optional()), __param(2, Inject(StorageBucket)),
        __param(3, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [Object, Object, String, Object,
            NgZone])
    ], AngularFireStorage);
    return AngularFireStorage;
}());
export { AngularFireStorage };
//# sourceMappingURL=storage.js.map