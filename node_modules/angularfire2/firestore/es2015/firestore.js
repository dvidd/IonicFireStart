import 'firebase/firestore';
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
export function associateQuery(collectionRef, queryFn = ref => ref) {
    const query = queryFn(collectionRef);
    const ref = collectionRef;
    return { query, ref };
}
export class AngularFirestore {
    constructor(app, shouldEnablePersistence) {
        this.app = app;
        this.firestore = app.firestore();
        this.persistenceEnabled$ = shouldEnablePersistence ?
            from(app.firestore().enablePersistence().then(() => true, () => false)) :
            from(new Promise((res, rej) => { res(false); }));
    }
    collection(path, queryFn) {
        const collectionRef = this.firestore.collection(path);
        const { ref, query } = associateQuery(collectionRef, queryFn);
        return new AngularFirestoreCollection(ref, query);
    }
    doc(path) {
        const ref = this.firestore.doc(path);
        return new AngularFirestoreDocument(ref);
    }
    createId() {
        return this.firestore.collection('_').doc().id;
    }
}
AngularFirestore.decorators = [
    { type: Injectable },
];
AngularFirestore.ctorParameters = () => [
    { type: FirebaseApp, },
    null,
];
//# sourceMappingURL=firestore.js.map