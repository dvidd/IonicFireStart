import { Observable } from 'rxjs/Observable';
import { DatabaseQuery, AngularFireAction } from '../interfaces';
import { database } from 'firebase/app';
export declare function createObjectSnapshotChanges(query: DatabaseQuery): () => Observable<AngularFireAction<database.DataSnapshot>>;
