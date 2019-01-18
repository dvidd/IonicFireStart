import { DatabaseQuery, ChildEvent, AngularFireAction } from '../interfaces';
import { Observable } from 'rxjs';
import { DatabaseSnapshot } from '../interfaces';
export declare function stateChanges<T>(query: DatabaseQuery, events?: ChildEvent[]): Observable<AngularFireAction<DatabaseSnapshot<T>>>;
