import { InjectionToken, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Settings, PersistenceSettings, CollectionReference, DocumentReference, QueryFn, AssociatedReference } from './interfaces';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { FirebaseFirestore, FirebaseOptions, FirebaseAppConfig, FirebaseZoneScheduler } from '@angular/fire';
import { firestore } from 'firebase/app';
export declare const EnablePersistenceToken: InjectionToken<boolean>;
export declare const PersistenceSettingsToken: InjectionToken<firestore.PersistenceSettings | undefined>;
export declare const FirestoreSettingsToken: InjectionToken<firestore.Settings>;
export declare const DefaultFirestoreSettings: firestore.Settings;
export declare function associateQuery(collectionRef: CollectionReference, queryFn?: (ref: any) => any): AssociatedReference;
export declare class AngularFirestore {
    readonly firestore: FirebaseFirestore;
    readonly persistenceEnabled$: Observable<boolean>;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | undefined, shouldEnablePersistence: boolean, settings: Settings, platformId: Object, zone: NgZone, persistenceSettings: PersistenceSettings | undefined);
    collection<T>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    collection<T>(ref: CollectionReference, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
    doc<T>(ref: DocumentReference): AngularFirestoreDocument<T>;
    createId(): string;
}
