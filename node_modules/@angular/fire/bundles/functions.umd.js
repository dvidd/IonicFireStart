(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/fire'), require('firebase/functions')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/fire', 'firebase/functions'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.functions = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.angularfire2));
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
    var FunctionsRegionToken = new core.InjectionToken('angularfire2.functions.region');
    var AngularFireFunctions = (function () {
        function AngularFireFunctions(options, nameOrConfig, platformId, zone, region) {
            this.scheduler = new fire.FirebaseZoneScheduler(zone, platformId);
            this.functions = zone.runOutsideAngular(function () {
                var app = fire._firebaseAppFactory(options, nameOrConfig);
                return app.functions(region || undefined);
            });
        }
        AngularFireFunctions.prototype.httpsCallable = function (name) {
            var _this = this;
            var callable = this.functions.httpsCallable(name);
            return function (data) {
                var callable$ = rxjs.from(callable(data));
                return _this.scheduler.runOutsideAngular(callable$.pipe(operators.map(function (r) { return r.data; })));
            };
        };
        AngularFireFunctions = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Inject(core.PLATFORM_ID)),
            __param(4, core.Optional()), __param(4, core.Inject(FunctionsRegionToken)),
            __metadata("design:paramtypes", [Object, Object, Object,
                core.NgZone, Object])
        ], AngularFireFunctions);
        return AngularFireFunctions;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFireFunctionsModule = (function () {
        function AngularFireFunctionsModule() {
        }
        AngularFireFunctionsModule = __decorate$1([
            core.NgModule({
                providers: [AngularFireFunctions]
            })
        ], AngularFireFunctionsModule);
        return AngularFireFunctionsModule;
    }());

    exports.FunctionsRegionToken = FunctionsRegionToken;
    exports.AngularFireFunctions = AngularFireFunctions;
    exports.AngularFireFunctionsModule = AngularFireFunctionsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
