(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators'), require('@angular/fire')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators', '@angular/fire'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.messaging = {}),global.ng.core,global.ng.common,global.rxjs,global.rxjs.operators,global.angularfire2));
}(this, (function (exports,core,common,rxjs,operators,fire) { 'use strict';

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
    var AngularFireMessaging = (function () {
        function AngularFireMessaging(options, nameOrConfig, platformId, zone) {
            var _this = this;
            if (common.isPlatformBrowser(platformId)) {
                var requireMessaging = rxjs.from(import('firebase/messaging'));
                this.messaging = requireMessaging.pipe(operators.map(function () { return fire._firebaseAppFactory(options, nameOrConfig); }), operators.map(function (app) { return app.messaging(); }), fire.runOutsideAngular(zone));
                this.requestPermission = this.messaging.pipe(operators.switchMap(function (messaging) { return messaging.requestPermission(); }), fire.runOutsideAngular(zone));
            }
            else {
                this.messaging = rxjs.empty();
                this.requestPermission = rxjs.throwError('Not available on server platform.');
            }
            this.getToken = this.messaging.pipe(operators.switchMap(function (messaging) { return messaging.getToken(); }), operators.defaultIfEmpty(null), fire.runOutsideAngular(zone));
            var tokenChanges = this.messaging.pipe(operators.switchMap(function (messaging) { return new rxjs.Observable(messaging.onTokenRefresh.bind(messaging)).pipe(operators.switchMap(function () { return messaging.getToken(); })); }), fire.runOutsideAngular(zone));
            this.tokenChanges = this.getToken.pipe(operators.concat(tokenChanges));
            this.messages = this.messaging.pipe(operators.switchMap(function (messaging) { return new rxjs.Observable(messaging.onMessage.bind(messaging)); }), fire.runOutsideAngular(zone));
            this.requestToken = this.requestPermission.pipe(operators.catchError(function () { return rxjs.of(null); }), operators.mergeMap(function () { return _this.tokenChanges; }));
            this.deleteToken = function (token) { return _this.messaging.pipe(operators.switchMap(function (messaging) { return messaging.deleteToken(token); }), operators.defaultIfEmpty(false), fire.runOutsideAngular(zone)); };
        }
        AngularFireMessaging = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Inject(core.PLATFORM_ID)),
            __metadata("design:paramtypes", [Object, Object, Object,
                core.NgZone])
        ], AngularFireMessaging);
        return AngularFireMessaging;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFireMessagingModule = (function () {
        function AngularFireMessagingModule() {
        }
        AngularFireMessagingModule = __decorate$1([
            core.NgModule({
                providers: [AngularFireMessaging]
            })
        ], AngularFireMessagingModule);
        return AngularFireMessagingModule;
    }());

    exports.AngularFireMessaging = AngularFireMessaging;
    exports.AngularFireMessagingModule = AngularFireMessagingModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
