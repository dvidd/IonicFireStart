import { Observable } from 'rxjs';
import { DatabaseQuery, DatabaseSnapshot, AngularFireAction } from '../interfaces';
export declare function createObjectSnapshotChanges<T>(query: DatabaseQuery): () => Observable<AngularFireAction<DatabaseSnapshot<T>>>;
