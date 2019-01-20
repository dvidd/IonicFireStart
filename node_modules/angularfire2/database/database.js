import { Injectable } from '@angular/core';
import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(app) {
        this.app = app;
        this.database = app.database();
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, queryFn) {
        var ref = getRef(this.app, pathOrRef);
        var query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef) {
        var ref = getRef(this.app, pathOrRef);
        return createObjectReference(ref);
    };
    AngularFireDatabase.prototype.createPushId = function () {
        return this.database.ref().push().key;
    };
    AngularFireDatabase.decorators = [
        { type: Injectable },
    ];
    AngularFireDatabase.ctorParameters = function () { return [
        { type: FirebaseApp, },
    ]; };
    return AngularFireDatabase;
}());
export { AngularFireDatabase };
//# sourceMappingURL=database.js.map