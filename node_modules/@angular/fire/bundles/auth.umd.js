(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/fire'), require('firebase/auth')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/fire', 'firebase/auth'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.auth = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.angularfire2));
}(this, (function (exports,core,rxjs,operators,fire) { 'use strict';

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var AngularFireAuth = (function () {
        function AngularFireAuth(options, nameOrConfig, platformId, zone) {
            var _this = this;
            this.zone = zone;
            var scheduler = new fire.FirebaseZoneScheduler(zone, platformId);
            this.auth = zone.runOutsideAngular(function () {
                var app = fire._firebaseAppFactory(options, nameOrConfig);
                return app.auth();
            });
            this.authState = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new rxjs.Observable(function (subscriber) {
                var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
                return { unsubscribe: unsubscribe };
            })));
            this.user = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new rxjs.Observable(function (subscriber) {
                var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
                return { unsubscribe: unsubscribe };
            })));
            this.idToken = this.user.pipe(operators.switchMap(function (user) {
                return user ? rxjs.from(user.getIdToken()) : rxjs.of(null);
            }));
            this.idTokenResult = this.user.pipe(operators.switchMap(function (user) {
                return user ? rxjs.from(user.getIdTokenResult()) : rxjs.of(null);
            }));
        }
        AngularFireAuth = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Inject(core.PLATFORM_ID)),
            __metadata("design:paramtypes", [Object, Object, Object,
                core.NgZone])
        ], AngularFireAuth);
        return AngularFireAuth;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFireAuthModule = (function () {
        function AngularFireAuthModule() {
        }
        AngularFireAuthModule = __decorate$1([
            core.NgModule({
                providers: [AngularFireAuth]
            })
        ], AngularFireAuthModule);
        return AngularFireAuthModule;
    }());

    exports.AngularFireAuth = AngularFireAuth;
    exports.AngularFireAuthModule = AngularFireAuthModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
