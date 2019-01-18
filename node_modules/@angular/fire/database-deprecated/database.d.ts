import { NgZone } from '@angular/core';
import { FirebaseListObservable } from './firebase_list_observable';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts, PathReference } from './interfaces';
import { FirebaseObjectObservable } from './firebase_object_observable';
import { FirebaseDatabase, FirebaseOptions, FirebaseAppConfig, RealtimeDatabaseURL } from '@angular/fire';
export declare class AngularFireDatabase {
    database: FirebaseDatabase;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, databaseURL: string, zone: NgZone);
    list(pathOrRef: PathReference, opts?: FirebaseListFactoryOpts): FirebaseListObservable<any[]>;
    object(pathOrRef: PathReference, opts?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
}
export { RealtimeDatabaseURL };
