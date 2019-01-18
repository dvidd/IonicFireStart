import { Observable } from 'rxjs';
import { DatabaseQuery, ChildEvent, SnapshotAction } from '../interfaces';
export declare function snapshotChanges<T>(query: DatabaseQuery, events?: ChildEvent[]): Observable<SnapshotAction<T>[]>;
