import 'firebase/firestore';
import { fromDocRef } from '../observable/fromRef';
import 'rxjs/add/operator/map';
import { associateQuery } from '../firestore';
import { AngularFirestoreCollection } from '../collection/collection';
var AngularFirestoreDocument = (function () {
    function AngularFirestoreDocument(ref) {
        this.ref = ref;
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
        return new AngularFirestoreCollection(ref, query);
    };
    AngularFirestoreDocument.prototype.snapshotChanges = function () {
        return fromDocRef(this.ref);
    };
    AngularFirestoreDocument.prototype.valueChanges = function () {
        return this.snapshotChanges().map(function (action) {
            return (action.payload.exists ? action.payload.data() : null);
        });
    };
    return AngularFirestoreDocument;
}());
export { AngularFirestoreDocument };
//# sourceMappingURL=document.js.map