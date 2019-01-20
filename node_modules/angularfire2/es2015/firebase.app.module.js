import { InjectionToken, } from '@angular/core';
import * as firebase from 'firebase/app';
export const FirebaseAppConfigToken = new InjectionToken('FirebaseAppConfigToken');
export class FirebaseApp {
}
export function _firebaseAppFactory(config, appName) {
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
//# sourceMappingURL=firebase.app.module.js.map