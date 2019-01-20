import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs/Observable';
import { QueryFn, Action } from '../interfaces';
import 'rxjs/add/operator/map';
import { AngularFirestoreCollection } from '../collection/collection';
export declare class AngularFirestoreDocument<T> {
    ref: firebase.firestore.DocumentReference;
    constructor(ref: firebase.firestore.DocumentReference);
    set(data: T, options?: firebase.firestore.SetOptions): Promise<void>;
    update(data: Partial<T>): Promise<void>;
    delete(): Promise<void>;
    collection<T>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    snapshotChanges(): Observable<Action<firebase.firestore.DocumentSnapshot>>;
    valueChanges(): Observable<T>;
}
