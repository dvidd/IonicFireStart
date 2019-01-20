import { InjectionToken } from '@angular/core';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AngularFirestore } from './firestore';
export declare const EnablePersistenceToken: InjectionToken<boolean>;
export declare function _getAngularFirestore(app: FirebaseApp, enablePersistence: boolean): AngularFirestore;
export declare const AngularFirestoreProvider: {
    provide: typeof AngularFirestore;
    useFactory: (app: FirebaseApp, enablePersistence: boolean) => AngularFirestore;
    deps: (InjectionToken<boolean> | typeof FirebaseApp)[];
};
export declare const FIRESTORE_PROVIDERS: ({
    provide: typeof AngularFirestore;
    useFactory: (app: FirebaseApp, enablePersistence: boolean) => AngularFirestore;
    deps: (InjectionToken<boolean> | typeof FirebaseApp)[];
} | {
    provide: InjectionToken<boolean>;
    useValue: boolean;
})[];
export declare class AngularFirestoreModule {
    static enablePersistence(): {
        ngModule: typeof AngularFireModule;
        providers: ({
            provide: typeof AngularFirestore;
            useFactory: (app: FirebaseApp, enablePersistence: boolean) => AngularFirestore;
            deps: (InjectionToken<boolean> | typeof FirebaseApp)[];
        } | {
            provide: InjectionToken<boolean>;
            useValue: boolean;
        })[];
    };
}
