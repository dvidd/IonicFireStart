import { Observable } from 'rxjs';
import { DocumentReference, SetOptions, DocumentData, QueryFn, Action, DocumentSnapshot } from '../interfaces';
import { AngularFirestore } from '../firestore';
import { AngularFirestoreCollection } from '../collection/collection';
import { firestore } from 'firebase/app';
export declare class AngularFirestoreDocument<T = DocumentData> {
    ref: DocumentReference;
    private afs;
    constructor(ref: DocumentReference, afs: AngularFirestore);
    set(data: T, options?: SetOptions): Promise<void>;
    update(data: Partial<T>): Promise<void>;
    delete(): Promise<void>;
    collection<R = DocumentData>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<R>;
    snapshotChanges(): Observable<Action<DocumentSnapshot<T>>>;
    valueChanges(): Observable<T | undefined>;
    get(options?: firestore.GetOptions): Observable<firestore.DocumentSnapshot>;
}
