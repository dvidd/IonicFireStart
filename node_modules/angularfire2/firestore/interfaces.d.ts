import { Subscriber } from 'rxjs/Subscriber';
import * as firebase from 'firebase/app';
export interface DocumentChangeAction {
    type: firebase.firestore.DocumentChangeType;
    payload: firebase.firestore.DocumentChange;
}
export interface Action<T> {
    type: string;
    payload: T;
}
export interface Reference<T> {
    onSnapshot: (sub: Subscriber<any>) => any;
}
export declare type QueryFn = (ref: firebase.firestore.CollectionReference) => firebase.firestore.Query;
export interface AssociatedReference {
    ref: firebase.firestore.CollectionReference;
    query: firebase.firestore.Query;
}
