import { Observable } from 'rxjs/Observable';
import 'firebase/database';
export class FirebaseObjectObservable extends Observable {
    constructor(subscribe, $ref) {
        super(subscribe);
        this.$ref = $ref;
    }
    lift(operator) {
        const observable = new FirebaseObjectObservable();
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    }
    set(value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.set(value);
    }
    update(value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.update(value);
    }
    remove() {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.remove();
    }
}
//# sourceMappingURL=firebase_object_observable.js.map