import { database } from 'firebase/app';
import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { PathReference, QueryFn, AngularFireList, AngularFireObject } from './interfaces';
export declare class AngularFireDatabase {
    app: FirebaseApp;
    database: database.Database;
    constructor(app: FirebaseApp);
    list<T>(pathOrRef: PathReference, queryFn?: QueryFn): AngularFireList<T>;
    object<T>(pathOrRef: PathReference): AngularFireObject<T>;
    createPushId(): string | null;
}
export { PathReference, DatabaseQuery, DatabaseReference, DatabaseSnapshot, ChildEvent, ListenEvent, QueryFn, AngularFireList, AngularFireObject, AngularFireAction, Action, SnapshotAction } from './interfaces';
