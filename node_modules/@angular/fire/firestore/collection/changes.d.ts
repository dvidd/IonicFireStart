import { Observable } from 'rxjs';
import { Query, DocumentChangeType, DocumentChange, DocumentChangeAction } from '../interfaces';
export declare function docChanges<T>(query: Query): Observable<DocumentChangeAction<T>[]>;
export declare function sortedChanges<T>(query: Query, events: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
export declare function combineChanges<T>(current: DocumentChange<T>[], changes: DocumentChange<T>[], events: DocumentChangeType[]): DocumentChange<T>[];
export declare function combineChange<T>(combined: DocumentChange<T>[], change: DocumentChange<T>): DocumentChange<T>[];
