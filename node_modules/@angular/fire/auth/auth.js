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
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, _firebaseAppFactory, FirebaseZoneScheduler } from '@angular/fire';
var AngularFireAuth = (function () {
    function AngularFireAuth(options, nameOrConfig, platformId, zone) {
        var _this = this;
        this.zone = zone;
        var scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.auth = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(options, nameOrConfig);
            return app.auth();
        });
        this.authState = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe: unsubscribe };
        })));
        this.user = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe: unsubscribe };
        })));
        this.idToken = this.user.pipe(switchMap(function (user) {
            return user ? from(user.getIdToken()) : of(null);
        }));
        this.idTokenResult = this.user.pipe(switchMap(function (user) {
            return user ? from(user.getIdTokenResult()) : of(null);
        }));
    }
    AngularFireAuth = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [Object, Object, Object,
            NgZone])
    ], AngularFireAuth);
    return AngularFireAuth;
}());
export { AngularFireAuth };
//# sourceMappingURL=auth.js.map