import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
export declare type FirebaseOperation = string | firebase.database.Reference | firebase.database.DataSnapshot;
export interface AngularFireList<T> {
    query: DatabaseQuery;
    valueChanges(events?: ChildEvent[]): Observable<T[]>;
    snapshotChanges(events?: ChildEvent[]): Observable<SnapshotAction[]>;
    stateChanges(events?: ChildEvent[]): Observable<SnapshotAction>;
    auditTrail(events?: ChildEvent[]): Observable<SnapshotAction[]>;
    update(item: FirebaseOperation, data: T): Promise<void>;
    set(item: FirebaseOperation, data: T): Promise<void>;
    push(data: T): firebase.database.ThenableReference;
    remove(item?: FirebaseOperation): Promise<void>;
}
export interface AngularFireObject<T> {
    query: DatabaseQuery;
    valueChanges(): Observable<T | null>;
    snapshotChanges(): Observable<SnapshotAction>;
    update(data: Partial<T>): Promise<void>;
    set(data: T): Promise<void>;
    remove(): Promise<void>;
}
export interface FirebaseOperationCases {
    stringCase: () => Promise<void>;
    firebaseCase?: () => Promise<void>;
    snapshotCase?: () => Promise<void>;
    unwrappedSnapshotCase?: () => Promise<void>;
}
export declare type QueryFn = (ref: DatabaseReference) => DatabaseQuery;
export declare type ChildEvent = 'child_added' | 'child_removed' | 'child_changed' | 'child_moved';
export declare type ListenEvent = 'value' | ChildEvent;
export interface Action<T> {
    type: ListenEvent;
    payload: T;
}
export interface AngularFireAction<T> extends Action<T> {
    prevKey: string | null | undefined;
    key: string | null;
}
export declare type SnapshotAction = AngularFireAction<DatabaseSnapshot>;
export declare type Primitive = number | string | boolean;
export declare type DatabaseSnapshot = firebase.database.DataSnapshot;
export declare type DatabaseReference = firebase.database.Reference;
export declare type DatabaseQuery = firebase.database.Query;
export declare type QueryReference = DatabaseReference | DatabaseQuery;
export declare type PathReference = QueryReference | string;
