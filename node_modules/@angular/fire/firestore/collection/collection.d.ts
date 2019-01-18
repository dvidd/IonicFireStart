import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { DocumentChangeType, CollectionReference, Query, DocumentReference, DocumentData, DocumentChangeAction } from '../interfaces';
import { AngularFirestoreDocument } from '../document/document';
import { AngularFirestore } from '../firestore';
export declare function validateEventsArray(events?: DocumentChangeType[]): firestore.DocumentChangeType[];
export declare class AngularFirestoreCollection<T = DocumentData> {
    readonly ref: CollectionReference;
    private readonly query;
    private readonly afs;
    constructor(ref: CollectionReference, query: Query, afs: AngularFirestore);
    stateChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    auditTrail(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    snapshotChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    valueChanges(): Observable<T[]>;
    get(options?: firestore.GetOptions): Observable<firestore.QuerySnapshot>;
    add(data: T): Promise<DocumentReference>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
}
