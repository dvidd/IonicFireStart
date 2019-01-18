import { from } from 'rxjs';
import { fromCollectionRef } from '../observable/fromRef';
import { map, filter, scan } from 'rxjs/operators';
import { docChanges, sortedChanges } from './changes';
import { AngularFirestoreDocument } from '../document/document';
import { runInZone } from '@angular/fire';
export function validateEventsArray(events) {
    if (!events || events.length === 0) {
        events = ['added', 'removed', 'modified'];
    }
    return events;
}
var AngularFirestoreCollection = (function () {
    function AngularFirestoreCollection(ref, query, afs) {
        this.ref = ref;
        this.query = query;
        this.afs = afs;
    }
    AngularFirestoreCollection.prototype.stateChanges = function (events) {
        if (!events || events.length === 0) {
            return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)));
        }
        return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)))
            .pipe(map(function (actions) { return actions.filter(function (change) { return events.indexOf(change.type) > -1; }); }), filter(function (changes) { return changes.length > 0; }));
    };
    AngularFirestoreCollection.prototype.auditTrail = function (events) {
        return this.stateChanges(events).pipe(scan(function (current, action) { return current.concat(action); }, []));
    };
    AngularFirestoreCollection.prototype.snapshotChanges = function (events) {
        var validatedEvents = validateEventsArray(events);
        var sortedChanges$ = sortedChanges(this.query, validatedEvents);
        var scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
    };
    AngularFirestoreCollection.prototype.valueChanges = function () {
        var fromCollectionRef$ = fromCollectionRef(this.query);
        var scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
            .pipe(map(function (actions) { return actions.payload.docs.map(function (a) { return a.data(); }); }));
    };
    AngularFirestoreCollection.prototype.get = function (options) {
        return from(this.query.get(options)).pipe(runInZone(this.afs.scheduler.zone));
    };
    AngularFirestoreCollection.prototype.add = function (data) {
        return this.ref.add(data);
    };
    AngularFirestoreCollection.prototype.doc = function (path) {
        return new AngularFirestoreDocument(this.ref.doc(path), this.afs);
    };
    return AngularFirestoreCollection;
}());
export { AngularFirestoreCollection };
//# sourceMappingURL=collection.js.map