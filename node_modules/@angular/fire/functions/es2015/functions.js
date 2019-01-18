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
import { Injectable, Inject, Optional, NgZone, PLATFORM_ID, InjectionToken } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, _firebaseAppFactory, FirebaseZoneScheduler } from '@angular/fire';
export const FunctionsRegionToken = new InjectionToken('angularfire2.functions.region');
let AngularFireFunctions = class AngularFireFunctions {
    constructor(options, nameOrConfig, platformId, zone, region) {
        this.scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.functions = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(options, nameOrConfig);
            return app.functions(region || undefined);
        });
    }
    httpsCallable(name) {
        const callable = this.functions.httpsCallable(name);
        return (data) => {
            const callable$ = from(callable(data));
            return this.scheduler.runOutsideAngular(callable$.pipe(map(r => r.data)));
        };
    }
};
AngularFireFunctions = __decorate([
    Injectable(),
    __param(0, Inject(FirebaseOptionsToken)),
    __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
    __param(2, Inject(PLATFORM_ID)),
    __param(4, Optional()), __param(4, Inject(FunctionsRegionToken)),
    __metadata("design:paramtypes", [Object, Object, Object,
        NgZone, Object])
], AngularFireFunctions);
export { AngularFireFunctions };
//# sourceMappingURL=functions.js.map