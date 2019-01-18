var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AngularFireModule_1;
import { InjectionToken, NgModule, Optional } from '@angular/core';
import firebase from 'firebase/app';
export const FirebaseOptionsToken = new InjectionToken('angularfire2.app.options');
export const FirebaseNameOrConfigToken = new InjectionToken('angularfire2.app.nameOrConfig');
export class FirebaseApp {
}
export function _firebaseAppFactory(options, nameOrConfig) {
    const name = typeof nameOrConfig === 'string' && nameOrConfig || '[DEFAULT]';
    const config = typeof nameOrConfig === 'object' && nameOrConfig || {};
    config.name = config.name || name;
    const existingApp = firebase.apps.filter(app => app && app.name === config.name)[0];
    return (existingApp || firebase.initializeApp(options, config));
}
const FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [
        FirebaseOptionsToken,
        [new Optional(), FirebaseNameOrConfigToken]
    ]
};
let AngularFireModule = AngularFireModule_1 = class AngularFireModule {
    static initializeApp(options, nameOrConfig) {
        return {
            ngModule: AngularFireModule_1,
            providers: [
                { provide: FirebaseOptionsToken, useValue: options },
                { provide: FirebaseNameOrConfigToken, useValue: nameOrConfig }
            ]
        };
    }
};
AngularFireModule = AngularFireModule_1 = __decorate([
    NgModule({
        providers: [FirebaseAppProvider],
    })
], AngularFireModule);
export { AngularFireModule };
//# sourceMappingURL=firebase.app.module.js.map