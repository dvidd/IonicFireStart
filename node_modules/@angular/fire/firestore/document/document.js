import { from } from 'rxjs';
import { fromDocRef } from '../observable/fromRef';
import { map } from 'rxjs/operators';
import { associateQuery } from '../firestore';
import { AngularFirestoreCollection } from '../collection/collection';
import { runInZone } from '@angular/fire';
var AngularFirestoreDocument = (function () {
    function AngularFirestoreDocument(ref, afs) {
        this.ref = ref;
        this.afs = afs;
    }
    AngularFirestoreDocument.prototype.set = function (data, options) {
        return this.ref.set(data, options);
    };
    AngularFirestoreDocument.prototype.update = function (data) {
        return this.ref.update(data);
    };
    AngularFirestoreDocument.prototype.delete = function () {
        return this.ref.delete();
    };
    AngularFirestoreDocument.prototype.collection = function (path, queryFn) {
        var collectionRef = this.ref.collection(path);
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query, this.afs);
    };
    AngularFirestoreDocument.prototype.snapshotChanges = function () {
        var fromDocRef$ = fromDocRef(this.ref);
        var scheduledFromDocRef$ = this.afs.scheduler.runOutsideAngular(fromDocRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledFromDocRef$);
    };
    AngularFirestoreDocument.prototype.valueChanges = function () {
        return this.snapshotChanges().pipe(map(function (action) {
            return action.payload.data();
        }));
    };
    AngularFirestoreDocument.prototype.get = function (options) {
        return from(this.ref.get(options)).pipe(runInZone(this.afs.scheduler.zone));
    };
    return AngularFirestoreDocument;
}());
export { AngularFirestoreDocument };
//# sourceMappingURL=document.js.map