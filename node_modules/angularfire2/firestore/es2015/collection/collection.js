import 'firebase/firestore';
import { fromCollectionRef } from '../observable/fromRef';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { docChanges, sortedChanges } from './changes';
import { AngularFirestoreDocument } from '../document/document';
export function validateEventsArray(events) {
    if (!events || events.length === 0) {
        events = ['added', 'removed', 'modified'];
    }
    return events;
}
export class AngularFirestoreCollection {
    constructor(ref, query) {
        this.ref = ref;
        this.query = query;
    }
    stateChanges(events) {
        if (!events || events.length === 0) {
            return docChanges(this.query);
        }
        return docChanges(this.query)
            .map(actions => actions.filter(change => events.indexOf(change.type) > -1))
            .filter(changes => changes.length > 0);
    }
    auditTrail(events) {
        return this.stateChanges(events).scan((current, action) => [...current, ...action], []);
    }
    snapshotChanges(events) {
        events = validateEventsArray(events);
        return sortedChanges(this.query, events);
    }
    valueChanges(events) {
        return fromCollectionRef(this.query)
            .map(actions => actions.payload.docs.map(a => a.data()));
    }
    add(data) {
        return this.ref.add(data);
    }
    doc(path) {
        return new AngularFirestoreDocument(this.ref.doc(path));
    }
}
//# sourceMappingURL=collection.js.map