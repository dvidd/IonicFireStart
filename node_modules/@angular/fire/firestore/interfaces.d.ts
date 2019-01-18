import { Subscriber } from 'rxjs';
import { firestore } from 'firebase/app';
export declare type Settings = firestore.Settings;
export declare type CollectionReference = firestore.CollectionReference;
export declare type DocumentReference = firestore.DocumentReference;
export declare type PersistenceSettings = firestore.PersistenceSettings;
export declare type DocumentChangeType = firestore.DocumentChangeType;
export declare type SnapshotOptions = firestore.SnapshotOptions;
export declare type FieldPath = firestore.FieldPath;
export declare type Query = firestore.Query;
export declare type SetOptions = firestore.SetOptions;
export declare type DocumentData = firestore.DocumentData;
export interface DocumentSnapshotExists<T> extends firestore.DocumentSnapshot {
    readonly exists: true;
    data(options?: SnapshotOptions): T;
}
export interface DocumentSnapshotDoesNotExist extends firestore.DocumentSnapshot {
    readonly exists: false;
    data(options?: SnapshotOptions): undefined;
    get(fieldPath: string | FieldPath, options?: SnapshotOptions): undefined;
}
export declare type DocumentSnapshot<T> = DocumentSnapshotExists<T> | DocumentSnapshotDoesNotExist;
export interface QueryDocumentSnapshot<T> extends firestore.QueryDocumentSnapshot {
    data(options?: SnapshotOptions): T;
}
export interface QuerySnapshot<T> extends firestore.QuerySnapshot {
    readonly docs: QueryDocumentSnapshot<T>[];
}
export interface DocumentChange<T> extends firestore.DocumentChange {
    readonly doc: QueryDocumentSnapshot<T>;
}
export interface DocumentChangeAction<T> {
    type: DocumentChangeType;
    payload: DocumentChange<T>;
}
export interface Action<T> {
    type: string;
    payload: T;
}
export interface Reference<T> {
    onSnapshot: (sub: Subscriber<any>) => any;
}
export declare type QueryFn = (ref: CollectionReference) => Query;
export interface AssociatedReference {
    ref: CollectionReference;
    query: Query;
}
