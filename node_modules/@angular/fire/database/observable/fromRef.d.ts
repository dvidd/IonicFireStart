import { DatabaseQuery, DatabaseSnapshot, ListenEvent, AngularFireAction } from '../interfaces';
import { Observable } from 'rxjs';
export declare function fromRef<T>(ref: DatabaseQuery, event: ListenEvent, listenType?: string): Observable<AngularFireAction<DatabaseSnapshot<T>>>;
