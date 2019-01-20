import 'firebase/firestore';
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
export function associateQuery(collectionRef, queryFn) {
    if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
    var query = queryFn(collectionRef);
    var ref = collectionRef;
    return { query: query, ref: ref };
}
var AngularFirestore = (function () {
    function AngularFirestore(app, shouldEnablePersistence) {
        this.app = app;
        this.firestore = app.firestore();
        this.persistenceEnabled$ = shouldEnablePersistence ?
            from(app.firestore().enablePersistence().then(function () { return true; }, function () { return false; })) :
            from(new Promise(function (res, rej) { res(false); }));
    }
    AngularFirestore.prototype.collection = function (path, queryFn) {
        var collectionRef = this.firestore.collection(path);
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query);
    };
    AngularFirestore.prototype.doc = function (path) {
        var ref = this.firestore.doc(path);
        return new AngularFirestoreDocument(ref);
    };
    AngularFirestore.prototype.createId = function () {
        return this.firestore.collection('_').doc().id;
    };
    AngularFirestore.decorators = [
        { type: Injectable },
    ];
    AngularFirestore.ctorParameters = function () { return [
        { type: FirebaseApp, },
        null,
    ]; };
    return AngularFirestore;
}());
export { AngularFirestore };
//# sourceMappingURL=firestore.js.map