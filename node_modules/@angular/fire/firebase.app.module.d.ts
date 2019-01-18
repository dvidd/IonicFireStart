import { InjectionToken } from '@angular/core';
import { app, auth, database, firestore, functions, messaging, storage } from 'firebase/app';
export declare type FirebaseOptions = {
    [key: string]: any;
};
export declare type FirebaseAppConfig = {
    [key: string]: any;
};
export declare const FirebaseOptionsToken: InjectionToken<FirebaseOptions>;
export declare const FirebaseNameOrConfigToken: InjectionToken<string | FirebaseAppConfig | undefined>;
export declare type FirebaseDatabase = database.Database;
export declare type FirebaseAuth = auth.Auth;
export declare type FirebaseMessaging = messaging.Messaging;
export declare type FirebaseStorage = storage.Storage;
export declare type FirebaseFirestore = firestore.Firestore;
export declare type FirebaseFunctions = functions.Functions;
export declare class FirebaseApp implements app.App {
    name: string;
    options: {};
    auth: () => FirebaseAuth;
    database: (databaseURL?: string) => FirebaseDatabase;
    messaging: () => FirebaseMessaging;
    storage: (storageBucket?: string) => FirebaseStorage;
    delete: () => Promise<void>;
    firestore: () => FirebaseFirestore;
    functions: (region?: string) => FirebaseFunctions;
}
export declare function _firebaseAppFactory(options: FirebaseOptions, nameOrConfig?: string | FirebaseAppConfig): FirebaseApp;
export declare class AngularFireModule {
    static initializeApp(options: FirebaseOptions, nameOrConfig?: string | FirebaseAppConfig): {
        ngModule: typeof AngularFireModule;
        providers: {
            provide: InjectionToken<string | FirebaseAppConfig | undefined>;
            useValue: string | FirebaseAppConfig | undefined;
        }[];
    };
}
