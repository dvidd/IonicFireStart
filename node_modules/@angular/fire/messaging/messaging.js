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
import { isPlatformBrowser } from '@angular/common';
import { Observable, empty, from, of, throwError } from 'rxjs';
import { mergeMap, catchError, map, switchMap, concat, defaultIfEmpty } from 'rxjs/operators';
import { runOutsideAngular } from '@angular/fire';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, _firebaseAppFactory } from '@angular/fire';
var AngularFireMessaging = (function () {
    function AngularFireMessaging(options, nameOrConfig, platformId, zone) {
        var _this = this;
        if (isPlatformBrowser(platformId)) {
            var requireMessaging = from(import('firebase/messaging'));
            this.messaging = requireMessaging.pipe(map(function () { return _firebaseAppFactory(options, nameOrConfig); }), map(function (app) { return app.messaging(); }), runOutsideAngular(zone));
            this.requestPermission = this.messaging.pipe(switchMap(function (messaging) { return messaging.requestPermission(); }), runOutsideAngular(zone));
        }
        else {
            this.messaging = empty();
            this.requestPermission = throwError('Not available on server platform.');
        }
        this.getToken = this.messaging.pipe(switchMap(function (messaging) { return messaging.getToken(); }), defaultIfEmpty(null), runOutsideAngular(zone));
        var tokenChanges = this.messaging.pipe(switchMap(function (messaging) { return new Observable(messaging.onTokenRefresh.bind(messaging)).pipe(switchMap(function () { return messaging.getToken(); })); }), runOutsideAngular(zone));
        this.tokenChanges = this.getToken.pipe(concat(tokenChanges));
        this.messages = this.messaging.pipe(switchMap(function (messaging) { return new Observable(messaging.onMessage.bind(messaging)); }), runOutsideAngular(zone));
        this.requestToken = this.requestPermission.pipe(catchError(function () { return of(null); }), mergeMap(function () { return _this.tokenChanges; }));
        this.deleteToken = function (token) { return _this.messaging.pipe(switchMap(function (messaging) { return messaging.deleteToken(token); }), defaultIfEmpty(false), runOutsideAngular(zone)); };
    }
    AngularFireMessaging = __decorate([
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [Object, Object, Object,
            NgZone])
    ], AngularFireMessaging);
    return AngularFireMessaging;
}());
export { AngularFireMessaging };
//# sourceMappingURL=messaging.js.map