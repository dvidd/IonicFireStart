import { Observable } from 'rxjs/Observable';
import { DatabaseQuery, ChildEvent, SnapshotAction } from '../interfaces';
import 'rxjs/add/operator/map';
export declare function snapshotChanges(query: DatabaseQuery, events?: ChildEvent[]): Observable<SnapshotAction[]>;
