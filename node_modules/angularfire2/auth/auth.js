import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { FirebaseApp, ZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
var AngularFireAuth = (function () {
    function AngularFireAuth(app) {
        var _this = this;
        this.app = app;
        this.auth = app.auth();
        var authState$ = new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe: unsubscribe };
        });
        this.authState = observeOn.call(authState$, new ZoneScheduler(Zone.current));
        var idToken$ = new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe: unsubscribe };
        }).switchMap(function (user) {
            return user ? Observable.fromPromise(user.getIdToken()) : Observable.of(null);
        });
        this.idToken = observeOn.call(idToken$, new ZoneScheduler(Zone.current));
    }
    AngularFireAuth.decorators = [
        { type: Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: FirebaseApp, },
    ]; };
    return AngularFireAuth;
}());
export { AngularFireAuth };
//# sourceMappingURL=auth.js.map