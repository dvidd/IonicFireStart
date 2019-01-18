import { NgZone } from '@angular/core';
import { PathReference, QueryFn, AngularFireList, AngularFireObject } from './interfaces';
import { FirebaseDatabase, FirebaseOptions, FirebaseAppConfig, RealtimeDatabaseURL, FirebaseZoneScheduler } from '@angular/fire';
export declare class AngularFireDatabase {
    readonly database: FirebaseDatabase;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, databaseURL: string, platformId: Object, zone: NgZone);
    list<T>(pathOrRef: PathReference, queryFn?: QueryFn): AngularFireList<T>;
    object<T>(pathOrRef: PathReference): AngularFireObject<T>;
    createPushId(): string | null;
}
export { PathReference, DatabaseSnapshot, ChildEvent, ListenEvent, QueryFn, AngularFireList, AngularFireObject, AngularFireAction, Action, SnapshotAction } from './interfaces';
export { RealtimeDatabaseURL };
