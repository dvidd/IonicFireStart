import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAppConfig, FirebaseOptions } from '@angular/fire';
import { User, auth } from 'firebase/app';
import { FirebaseAuth } from '@angular/fire';
export declare class AngularFireAuth {
    private zone;
    readonly auth: FirebaseAuth;
    readonly authState: Observable<User | null>;
    readonly idToken: Observable<string | null>;
    readonly user: Observable<User | null>;
    readonly idTokenResult: Observable<auth.IdTokenResult | null>;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, platformId: Object, zone: NgZone);
}
