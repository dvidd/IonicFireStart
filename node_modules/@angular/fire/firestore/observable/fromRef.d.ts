import { Observable } from 'rxjs';
import { DocumentReference, Query, Action, DocumentSnapshot, QuerySnapshot } from '../interfaces';
export declare function fromRef<R>(ref: DocumentReference | Query): Observable<R>;
export declare function fromDocRef<T>(ref: DocumentReference): Observable<Action<DocumentSnapshot<T>>>;
export declare function fromCollectionRef<T>(ref: Query): Observable<Action<QuerySnapshot<T>>>;
