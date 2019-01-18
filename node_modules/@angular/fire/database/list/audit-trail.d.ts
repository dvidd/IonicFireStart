import { DatabaseQuery, ChildEvent, SnapshotAction } from '../interfaces';
import { Observable } from 'rxjs';
export declare function auditTrail<T>(query: DatabaseQuery, events?: ChildEvent[]): Observable<SnapshotAction<T>[]>;
