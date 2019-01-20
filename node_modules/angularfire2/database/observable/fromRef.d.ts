import { DatabaseQuery, DatabaseSnapshot, ListenEvent, AngularFireAction } from '../interfaces';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
export declare function fromRef(ref: DatabaseQuery, event: ListenEvent, listenType?: string): Observable<AngularFireAction<DatabaseSnapshot>>;
