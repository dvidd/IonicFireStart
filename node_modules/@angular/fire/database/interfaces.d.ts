import { Observable } from 'rxjs';
import { database } from 'firebase/app';
export declare type FirebaseOperation = string | database.Reference | database.DataSnapshot;
export interface AngularFireList<T> {
    query: DatabaseQuery;
    valueChanges(events?: ChildEvent[]): Observable<T[]>;
    snapshotChanges(events?: ChildEvent[]): Observable<SnapshotAction<T>[]>;
    stateChanges(events?: ChildEvent[]): Observable<SnapshotAction<T>>;
    auditTrail(events?: ChildEvent[]): Observable<SnapshotAction<T>[]>;
    update(item: FirebaseOperation, data: T): Promise<void>;
    set(item: FirebaseOperation, data: T): Promise<void>;
    push(data: T): database.ThenableReference;
    remove(item?: FirebaseOperation): Promise<void>;
}
export interface AngularFireObject<T> {
    query: DatabaseQuery;
    valueChanges(): Observable<T | null>;
    snapshotChanges(): Observable<SnapshotAction<T>>;
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
export declare type SnapshotAction<T> = AngularFireAction<DatabaseSnapshot<T>>;
export declare type Primitive = number | string | boolean;
export interface DatabaseSnapshotExists<T> extends database.DataSnapshot {
    exists(): true;
    val(): T;
    forEach(action: (a: DatabaseSnapshot<T>) => boolean): boolean;
}
export interface DatabaseSnapshotDoesNotExist<T> extends database.DataSnapshot {
    exists(): false;
    val(): null;
    forEach(action: (a: DatabaseSnapshot<T>) => boolean): boolean;
}
export declare type DatabaseSnapshot<T> = DatabaseSnapshotExists<T> | DatabaseSnapshotDoesNotExist<T>;
export declare type DatabaseReference = database.Reference;
export declare type DatabaseQuery = database.Query;
export declare type DataSnapshot = database.DataSnapshot;
export declare type QueryReference = DatabaseReference | DatabaseQuery;
export declare type PathReference = QueryReference | string;
