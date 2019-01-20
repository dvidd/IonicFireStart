import 'firebase/firestore';
import { fromDocRef } from '../observable/fromRef';
import 'rxjs/add/operator/map';
import { associateQuery } from '../firestore';
import { AngularFirestoreCollection } from '../collection/collection';
export class AngularFirestoreDocument {
    constructor(ref) {
        this.ref = ref;
    }
    set(data, options) {
        return this.ref.set(data, options);
    }
    update(data) {
        return this.ref.update(data);
    }
    delete() {
        return this.ref.delete();
    }
    collection(path, queryFn) {
        const collectionRef = this.ref.collection(path);
        const { ref, query } = associateQuery(collectionRef, queryFn);
        return new AngularFirestoreCollection(ref, query);
    }
    snapshotChanges() {
        return fromDocRef(this.ref);
    }
    valueChanges() {
        return this.snapshotChanges().map(action => {
            return (action.payload.exists ? action.payload.data() : null);
        });
    }
}
//# sourceMappingURL=document.js.map