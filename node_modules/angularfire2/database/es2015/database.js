import { Injectable } from '@angular/core';
import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
export class AngularFireDatabase {
    constructor(app) {
        this.app = app;
        this.database = app.database();
    }
    list(pathOrRef, queryFn) {
        const ref = getRef(this.app, pathOrRef);
        let query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query);
    }
    object(pathOrRef) {
        const ref = getRef(this.app, pathOrRef);
        return createObjectReference(ref);
    }
    createPushId() {
        return this.database.ref().push().key;
    }
}
AngularFireDatabase.decorators = [
    { type: Injectable },
];
AngularFireDatabase.ctorParameters = () => [
    { type: FirebaseApp, },
];
//# sourceMappingURL=database.js.map