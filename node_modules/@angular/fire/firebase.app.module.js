var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InjectionToken, NgModule, Optional } from '@angular/core';
import firebase from 'firebase/app';
export var FirebaseOptionsToken = new InjectionToken('angularfire2.app.options');
export var FirebaseNameOrConfigToken = new InjectionToken('angularfire2.app.nameOrConfig');
var FirebaseApp = (function () {
    function FirebaseApp() {
    }
    return FirebaseApp;
}());
export { FirebaseApp };
export function _firebaseAppFactory(options, nameOrConfig) {
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
        [new Optional(), FirebaseNameOrConfigToken]
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
        NgModule({
            providers: [FirebaseAppProvider],
        })
    ], AngularFireModule);
    return AngularFireModule;
}());
export { AngularFireModule };
//# sourceMappingURL=firebase.app.module.js.map