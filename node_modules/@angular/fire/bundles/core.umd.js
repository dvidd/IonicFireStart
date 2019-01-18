(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('firebase/app')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs', 'firebase/app'], factory) :
    (factory((global.angularfire2 = {}),global.ng.core,global.ng.common,global.rxjs,global.firebase));
}(this, (function (exports,core,common,rxjs,firebase) { 'use strict';

    firebase = firebase && firebase.hasOwnProperty('default') ? firebase['default'] : firebase;

    var RealtimeDatabaseURL = new core.InjectionToken('angularfire2.realtimeDatabaseURL');
    var FirebaseZoneScheduler = (function () {
        function FirebaseZoneScheduler(zone, platformId) {
            this.zone = zone;
            this.platformId = platformId;
        }
        FirebaseZoneScheduler.prototype.schedule = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.zone.runGuarded(function () { return rxjs.queueScheduler.schedule.apply(rxjs.queueScheduler, args); });
        };
        FirebaseZoneScheduler.prototype.keepUnstableUntilFirst = function (obs$) {
            if (common.isPlatformServer(this.platformId)) {
                return new rxjs.Observable(function (subscriber) {
                    var noop = function () { };
                    var task = Zone.current.scheduleMacroTask('firebaseZoneBlock', noop, {}, noop, noop);
                    obs$.subscribe(function (next) {
                        if (task.state === 'scheduled') {
                            task.invoke();
                        }
                        subscriber.next(next);
                    }, function (error) {
                        if (task.state === 'scheduled') {
                            task.invoke();
                        }
                        subscriber.error(error);
                    }, function () {
                        if (task.state === 'scheduled') {
                            task.invoke();
                        }
                        subscriber.complete();
                    });
                });
            }
            else {
                return obs$;
            }
        };
        FirebaseZoneScheduler.prototype.runOutsideAngular = function (obs$) {
            var _this = this;
            return new rxjs.Observable(function (subscriber) {
                return _this.zone.runOutsideAngular(function () {
                    return obs$.subscribe(function (value) { return _this.zone.run(function () { return subscriber.next(value); }); }, function (error) { return _this.zone.run(function () { return subscriber.error(error); }); }, function () { return _this.zone.run(function () { return subscriber.complete(); }); });
                });
            });
        };
        return FirebaseZoneScheduler;
    }());
    var runOutsideAngular = function (zone) { return function (obs$) {
        return new rxjs.Observable(function (subscriber) {
            return zone.runOutsideAngular(function () {
                runInZone(zone)(obs$).subscribe(subscriber);
            });
        });
    }; };
    var runInZone = function (zone) { return function (obs$) {
        return new rxjs.Observable(function (subscriber) {
            return obs$.subscribe(function (value) { return zone.run(function () { return subscriber.next(value); }); }, function (error) { return zone.run(function () { return subscriber.error(error); }); }, function () { return zone.run(function () { return subscriber.complete(); }); });
        });
    }; };

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FirebaseOptionsToken = new core.InjectionToken('angularfire2.app.options');
    var FirebaseNameOrConfigToken = new core.InjectionToken('angularfire2.app.nameOrConfig');
    var FirebaseApp = (function () {
        function FirebaseApp() {
        }
        return FirebaseApp;
    }());
    function _firebaseAppFactory(options, nameOrConfig) {
        var name = typeof nameOrConfig === 'string' && nameOrConfig || '[DEFAULT]';
        var config = typeof nameOrConfig === 'object' && nameOrConfig || {};
        config.name = config.name || name;
        var existingApp = firebase.apps.filter(function (app) { return app && app.name === config.name; })[0];
        return (existingApp || firebase.initializeApp(options, config));
    }
    var FirebaseAppProvider = {
        provide: FirebaseApp,
        useFactory: _firebaseAppFactory,
        deps: [
            FirebaseOptionsToken,
            [new core.Optional(), FirebaseNameOrConfigToken]
        ]
    };
    var AngularFireModule = (function () {
        function AngularFireModule() {
        }
        AngularFireModule_1 = AngularFireModule;
        AngularFireModule.initializeApp = function (options, nameOrConfig) {
            return {
                ngModule: AngularFireModule_1,
                providers: [
                    { provide: FirebaseOptionsToken, useValue: options },
                    { provide: FirebaseNameOrConfigToken, useValue: nameOrConfig }
                ]
            };
        };
        var AngularFireModule_1;
        AngularFireModule = AngularFireModule_1 = __decorate([
            core.NgModule({
                providers: [FirebaseAppProvider],
            })
        ], AngularFireModule);
        return AngularFireModule;
    }());

    exports.RealtimeDatabaseURL = RealtimeDatabaseURL;
    exports.FirebaseZoneScheduler = FirebaseZoneScheduler;
    exports.runOutsideAngular = runOutsideAngular;
    exports.runInZone = runInZone;
    exports.FirebaseOptionsToken = FirebaseOptionsToken;
    exports.FirebaseNameOrConfigToken = FirebaseNameOrConfigToken;
    exports.FirebaseApp = FirebaseApp;
    exports._firebaseAppFactory = _firebaseAppFactory;
    exports.AngularFireModule = AngularFireModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
