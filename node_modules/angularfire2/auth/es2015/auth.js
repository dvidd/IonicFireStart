import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { FirebaseApp, ZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
export class AngularFireAuth {
    constructor(app) {
        this.app = app;
        this.auth = app.auth();
        const authState$ = new Observable(subscriber => {
            const unsubscribe = this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe };
        });
        this.authState = observeOn.call(authState$, new ZoneScheduler(Zone.current));
        const idToken$ = new Observable(subscriber => {
            const unsubscribe = this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe };
        }).switchMap(user => {
            return user ? Observable.fromPromise(user.getIdToken()) : Observable.of(null);
        });
        this.idToken = observeOn.call(idToken$, new ZoneScheduler(Zone.current));
    }
}
AngularFireAuth.decorators = [
    { type: Injectable },
];
AngularFireAuth.ctorParameters = () => [
    { type: FirebaseApp, },
];
//# sourceMappingURL=auth.js.map