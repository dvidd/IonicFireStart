import { Observable } from 'rxjs';
import * as utils from './utils';
export class FirebaseListObservable extends Observable {
    constructor($ref, subscribe) {
        super(subscribe);
        this.$ref = $ref;
    }
    lift(operator) {
        const observable = new FirebaseListObservable(this.$ref);
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    }
    push(val) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.ref.push(val);
    }
    set(item, value) {
        return this._checkOperationCases(item, {
            stringCase: () => this.$ref.ref.child(item).set(value),
            firebaseCase: () => item.set(value),
            snapshotCase: () => item.ref.set(value),
            unwrappedSnapshotCase: () => this.$ref.ref.child(item.$key).set(value)
        });
    }
    update(item, value) {
        return this._checkOperationCases(item, {
            stringCase: () => this.$ref.ref.child(item).update(value),
            firebaseCase: () => item.update(value),
            snapshotCase: () => item.ref.update(value),
            unwrappedSnapshotCase: () => this.$ref.ref.child(item.$key).update(value)
        });
    }
    remove(item) {
        if (!item) {
            return this.$ref.ref.remove();
        }
        return this._checkOperationCases(item, {
            stringCase: () => this.$ref.ref.child(item).remove(),
            firebaseCase: () => item.remove(),
            snapshotCase: () => item.ref.remove(),
            unwrappedSnapshotCase: () => this.$ref.ref.child(item.$key).remove()
        });
    }
    _checkOperationCases(item, cases) {
        if (utils.isString(item)) {
            return cases.stringCase();
        }
        else if (utils.isFirebaseRef(item)) {
            return cases.firebaseCase();
        }
        else if (utils.isFirebaseDataSnapshot(item)) {
            return cases.snapshotCase();
        }
        else if (utils.isAFUnwrappedSnapshot(item)) {
            return cases.unwrappedSnapshotCase();
        }
        throw new Error(`Method requires a key, snapshot, reference, or unwrapped snapshot. Got: ${typeof item}`);
    }
}
//# sourceMappingURL=firebase_list_observable.js.map