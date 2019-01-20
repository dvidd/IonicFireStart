import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { DocumentChangeAction } from '../interfaces';
import { AngularFirestoreDocument } from '../document/document';
export declare function validateEventsArray(events?: firebase.firestore.DocumentChangeType[]): firebase.firestore.DocumentChangeType[];
export declare class AngularFirestoreCollection<T> {
    readonly ref: firebase.firestore.CollectionReference;
    private readonly query;
    constructor(ref: firebase.firestore.CollectionReference, query: firebase.firestore.Query);
    stateChanges(events?: firebase.firestore.DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    auditTrail(events?: firebase.firestore.DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    snapshotChanges(events?: firebase.firestore.DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    valueChanges(events?: firebase.firestore.DocumentChangeType[]): Observable<T[]>;
    add(data: T): Promise<firebase.firestore.DocumentReference>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
}
