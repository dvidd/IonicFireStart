import { FirebaseAppConfigToken, FirebaseApp } from './firebase.app.module';
import { InjectionToken } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
export interface FirebaseAppConfig {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    projectId?: string;
}
declare const FirebaseAppName: InjectionToken<string>;
export declare const FirebaseAppProvider: {
    provide: typeof FirebaseApp;
    useFactory: (config: FirebaseAppConfig, appName?: string | undefined) => FirebaseApp;
    deps: InjectionToken<FirebaseAppConfig>[];
};
export declare class AngularFireModule {
    static initializeApp(config: FirebaseAppConfig, appName?: string): {
        ngModule: typeof AngularFireModule;
        providers: ({
            provide: InjectionToken<FirebaseAppConfig>;
            useValue: FirebaseAppConfig;
        } | {
            provide: InjectionToken<string>;
            useValue: string | undefined;
        })[];
    };
}
export declare class ZoneScheduler {
    zone: any;
    constructor(zone: any);
    schedule(...args: any[]): Subscription;
}
export { FirebaseApp, FirebaseAppName, FirebaseAppConfigToken };
