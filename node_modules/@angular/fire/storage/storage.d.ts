import { InjectionToken, NgZone } from '@angular/core';
import { AngularFireStorageReference } from './ref';
import { AngularFireUploadTask } from './task';
import { FirebaseStorage, FirebaseOptions, FirebaseAppConfig, FirebaseZoneScheduler } from '@angular/fire';
import { UploadMetadata } from './interfaces';
export declare const StorageBucket: InjectionToken<string>;
export declare class AngularFireStorage {
    readonly storage: FirebaseStorage;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, storageBucket: string, platformId: Object, zone: NgZone);
    ref(path: string): AngularFireStorageReference;
    upload(path: string, data: any, metadata?: UploadMetadata): AngularFireUploadTask;
}
