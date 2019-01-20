import 'firebase/database';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { FirebaseListFactory } from './firebase_list_factory';
import { FirebaseObjectFactory } from './firebase_object_factory';
import * as utils from './utils';
export class AngularFireDatabase {
    constructor(app) {
        this.app = app;
        this.database = app.database();
    }
    list(pathOrRef, opts) {
        const ref = utils.getRef(this.app, pathOrRef);
        return FirebaseListFactory(ref, opts);
    }
    object(pathOrRef, opts) {
        const ref = utils.getRef(this.app, pathOrRef);
        return FirebaseObjectFactory(ref, opts);
    }
}
AngularFireDatabase.decorators = [
    { type: Injectable },
];
AngularFireDatabase.ctorParameters = () => [
    { type: FirebaseApp, },
];
//# sourceMappingURL=database.js.map