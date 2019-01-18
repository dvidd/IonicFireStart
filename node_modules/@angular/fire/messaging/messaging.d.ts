import { NgZone } from '@angular/core';
import { messaging } from 'firebase/app';
import { Observable } from 'rxjs';
import { FirebaseOptions, FirebaseAppConfig } from '@angular/fire';
export declare class AngularFireMessaging {
    messaging: Observable<messaging.Messaging>;
    requestPermission: Observable<void>;
    getToken: Observable<string | null>;
    tokenChanges: Observable<string | null>;
    messages: Observable<{}>;
    requestToken: Observable<string | null>;
    deleteToken: (token: string) => Observable<boolean>;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, platformId: Object, zone: NgZone);
}
