import { InjectionToken } from '@angular/core';
import { FirebaseAppConfig } from './';
import * as firebase from 'firebase/app';
export declare const FirebaseAppConfigToken: InjectionToken<FirebaseAppConfig>;
export declare class FirebaseApp implements firebase.app.App {
    name: string;
    options: {};
    auth: () => firebase.auth.Auth;
    database: () => firebase.database.Database;
    messaging: () => firebase.messaging.Messaging;
    storage: () => firebase.storage.Storage;
    delete: () => Promise<any>;
    firestore: () => firebase.firestore.Firestore;
}
export declare function _firebaseAppFactory(config: FirebaseAppConfig, appName?: string): FirebaseApp;
