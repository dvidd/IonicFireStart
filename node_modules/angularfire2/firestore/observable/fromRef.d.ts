import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Action } from '../interfaces';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
export declare function fromRef<R>(ref: firebase.firestore.DocumentReference | firebase.firestore.Query): Observable<R>;
export declare function fromDocRef(ref: firebase.firestore.DocumentReference): Observable<Action<firebase.firestore.DocumentSnapshot>>;
export declare function fromCollectionRef(ref: firebase.firestore.Query): Observable<Action<firebase.firestore.QuerySnapshot>>;
