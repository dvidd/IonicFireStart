import 'firebase/database';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { FirebaseListFactory } from './firebase_list_factory';
import { FirebaseObjectFactory } from './firebase_object_factory';
import * as utils from './utils';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(app) {
        this.app = app;
        this.database = app.database();
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, opts) {
        var ref = utils.getRef(this.app, pathOrRef);
        return FirebaseListFactory(ref, opts);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef, opts) {
        var ref = utils.getRef(this.app, pathOrRef);
        return FirebaseObjectFactory(ref, opts);
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