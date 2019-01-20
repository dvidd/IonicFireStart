(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('firebase/auth'), require('@angular/core'), require('rxjs/Observable'), require('rxjs/operator/observeOn'), require('angularfire2'), require('rxjs/add/operator/switchMap'), require('rxjs/add/observable/of'), require('rxjs/add/observable/fromPromise')) :
    typeof define === 'function' && define.amd ? define(['exports', 'firebase/auth', '@angular/core', 'rxjs/Observable', 'rxjs/operator/observeOn', 'angularfire2', 'rxjs/add/operator/switchMap', 'rxjs/add/observable/of', 'rxjs/add/observable/fromPromise'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.auth = global.angularfire2.auth || {}),global.firebase,global.ng.core,global.Rx,global.Rx.Observable.prototype,global.angularfire2,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,firebase_auth,_angular_core,rxjs_Observable,rxjs_operator_observeOn,angularfire2,rxjs_add_operator_switchMap,rxjs_add_observable_of,rxjs_add_observable_fromPromise) { 'use strict';

var AngularFireAuth = (function () {
    function AngularFireAuth(app) {
        var _this = this;
        this.app = app;
        this.auth = app.auth();
        var authState$ = new rxjs_Observable.Observable(function (subscriber) {
            var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe: unsubscribe };
        });
        this.authState = rxjs_operator_observeOn.observeOn.call(authState$, new angularfire2.ZoneScheduler(Zone.current));
        var idToken$ = new rxjs_Observable.Observable(function (subscriber) {
            var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe: unsubscribe };
        }).switchMap(function (user) {
            return user ? rxjs_Observable.Observable.fromPromise(user.getIdToken()) : rxjs_Observable.Observable.of(null);
        });
        this.idToken = rxjs_operator_observeOn.observeOn.call(idToken$, new angularfire2.ZoneScheduler(Zone.current));
    }
    AngularFireAuth.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: angularfire2.FirebaseApp, },
    ]; };
    return AngularFireAuth;
}());

function _getAngularFireAuth(app) {
    return new AngularFireAuth(app);
}
var AngularFireAuthProvider = {
    provide: AngularFireAuth,
    useFactory: _getAngularFireAuth,
    deps: [angularfire2.FirebaseApp]
};
var AUTH_PROVIDERS = [
    AngularFireAuthProvider,
];
var AngularFireAuthModule = (function () {
    function AngularFireAuthModule() {
    }
    AngularFireAuthModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [angularfire2.AngularFireModule],
                    providers: [AUTH_PROVIDERS]
                },] },
    ];
    AngularFireAuthModule.ctorParameters = function () { return []; };
    return AngularFireAuthModule;
}());

exports.AngularFireAuth = AngularFireAuth;
exports._getAngularFireAuth = _getAngularFireAuth;
exports.AngularFireAuthProvider = AngularFireAuthProvider;
exports.AUTH_PROVIDERS = AUTH_PROVIDERS;
exports.AngularFireAuthModule = AngularFireAuthModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
