import { NgModule, InjectionToken } from '@angular/core';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AngularFirestore } from './firestore';
export var EnablePersistenceToken = new InjectionToken('EnablePersistenceToken');
export function _getAngularFirestore(app, enablePersistence) {
    return new AngularFirestore(app, enablePersistence);
}
export var AngularFirestoreProvider = {
    provide: AngularFirestore,
    useFactory: _getAngularFirestore,
    deps: [FirebaseApp, EnablePersistenceToken]
};
export var FIRESTORE_PROVIDERS = [
    AngularFirestoreProvider,
    { provide: EnablePersistenceToken, useValue: false },
];
var AngularFirestoreModule = (function () {
    function AngularFirestoreModule() {
    }
    AngularFirestoreModule.enablePersistence = function () {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: EnablePersistenceToken, useValue: true },
                AngularFirestoreProvider
            ]
        };
    };
    AngularFirestoreModule.decorators = [
        { type: NgModule, args: [{
                    imports: [AngularFireModule],
                    providers: [FIRESTORE_PROVIDERS]
                },] },
    ];
    AngularFirestoreModule.ctorParameters = function () { return []; };
    return AngularFirestoreModule;
}());
export { AngularFirestoreModule };
//# sourceMappingURL=firestore.module.js.map