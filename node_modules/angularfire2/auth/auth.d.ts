import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
export declare class AngularFireAuth {
    app: FirebaseApp;
    readonly auth: firebase.auth.Auth;
    readonly authState: Observable<firebase.User | null>;
    readonly idToken: Observable<string | null>;
    constructor(app: FirebaseApp);
}
