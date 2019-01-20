import { NgModule, InjectionToken } from '@angular/core';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AngularFirestore } from './firestore';
export const EnablePersistenceToken = new InjectionToken('EnablePersistenceToken');
export function _getAngularFirestore(app, enablePersistence) {
    return new AngularFirestore(app, enablePersistence);
}
export const AngularFirestoreProvider = {
    provide: AngularFirestore,
    useFactory: _getAngularFirestore,
    deps: [FirebaseApp, EnablePersistenceToken]
};
export const FIRESTORE_PROVIDERS = [
    AngularFirestoreProvider,
    { provide: EnablePersistenceToken, useValue: false },
];
export class AngularFirestoreModule {
    static enablePersistence() {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: EnablePersistenceToken, useValue: true },
                AngularFirestoreProvider
            ]
        };
    }
}
AngularFirestoreModule.decorators = [
    { type: NgModule, args: [{
                imports: [AngularFireModule],
                providers: [FIRESTORE_PROVIDERS]
            },] },
];
AngularFirestoreModule.ctorParameters = () => [];
//# sourceMappingURL=firestore.module.js.map