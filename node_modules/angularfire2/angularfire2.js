import { FirebaseAppConfigToken, FirebaseApp, _firebaseAppFactory } from './firebase.app.module';
import { InjectionToken, NgModule } from '@angular/core';
import { queue } from 'rxjs/scheduler/queue';
var FirebaseAppName = new InjectionToken('FirebaseAppName');
export var FirebaseAppProvider = {
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
        { type: NgModule, args: [{
                    providers: [FirebaseAppProvider],
                },] },
    ];
    AngularFireModule.ctorParameters = function () { return []; };
    return AngularFireModule;
}());
export { AngularFireModule };
var ZoneScheduler = (function () {
    function ZoneScheduler(zone) {
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.run(function () { return queue.schedule.apply(queue, args); });
    };
    return ZoneScheduler;
}());
export { ZoneScheduler };
export { FirebaseApp, FirebaseAppName, FirebaseAppConfigToken };
//# sourceMappingURL=angularfire2.js.map