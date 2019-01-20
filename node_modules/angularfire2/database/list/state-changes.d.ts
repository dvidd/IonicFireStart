import { DatabaseQuery, ChildEvent, AngularFireAction } from '../interfaces';
import { Observable } from 'rxjs/Observable';
import { database } from 'firebase/app';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';
export declare function createStateChanges(query: DatabaseQuery): (events?: ChildEvent[] | undefined) => Observable<AngularFireAction<database.DataSnapshot>>;
export declare function stateChanges(query: DatabaseQuery, events?: ChildEvent[]): Observable<AngularFireAction<database.DataSnapshot>>;
