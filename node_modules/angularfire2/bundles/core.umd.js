(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('firebase/app'), require('rxjs/scheduler/queue')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'firebase/app', 'rxjs/scheduler/queue'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}),global.ng.core,global.firebase,global.Rx.Scheduler));
}(this, (function (exports,_angular_core,firebase,rxjs_scheduler_queue) { 'use strict';

var FirebaseAppConfigToken = new _angular_core.InjectionToken('FirebaseAppConfigToken');
var FirebaseApp = (function () {
    function FirebaseApp() {
    }
    return FirebaseApp;
}());
function _firebaseAppFactory(config, appName) {
    try {
        if (appName) {
            return firebase.initializeApp(config, appName);
        }
        else {
            return firebase.initializeApp(config);
        }
    }
    catch (e) {
        if (e.code === "app/duplicate-app") {
            return firebase.app(e.name);
        }
        return firebase.app((null));
    }
}

var FirebaseAppName = new _angular_core.InjectionToken('FirebaseAppName');
var FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [FirebaseAppConfigToken, FirebaseAppName]
};
var AngularFireModule = (function () {
    function AngularFireModule() {
    }
    AngularFireModule.initializeApp = function (config, appName) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseAppConfigToken, useValue: config },
                { provide: FirebaseAppName, useValue: appName }
            ]
        };
    };
    AngularFireModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [FirebaseAppProvider],
                },] },
    ];
    AngularFireModule.ctorParameters = function () { return []; };
    return AngularFireModule;
}());
var ZoneScheduler = (function () {
    function ZoneScheduler(zone) {
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.run(function () { return rxjs_scheduler_queue.queue.schedule.apply(rxjs_scheduler_queue.queue, args); });
    };
    return ZoneScheduler;
}());

exports.ɵa = _firebaseAppFactory;
exports.FirebaseAppProvider = FirebaseAppProvider;
exports.AngularFireModule = AngularFireModule;
exports.ZoneScheduler = ZoneScheduler;
exports.FirebaseApp = FirebaseApp;
exports.FirebaseAppName = FirebaseAppName;
exports.FirebaseAppConfigToken = FirebaseAppConfigToken;

Object.defineProperty(exports, '__esModule', { value: true });

})));
