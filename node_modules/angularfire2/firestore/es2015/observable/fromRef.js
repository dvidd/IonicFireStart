import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { ZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
function _fromRef(ref) {
    const ref$ = new Observable(subscriber => {
        const unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe };
    });
    return observeOn.call(ref$, new ZoneScheduler(Zone.current));
}
export function fromRef(ref) {
    return _fromRef(ref).share();
}
export function fromDocRef(ref) {
    return fromRef(ref)
        .map(payload => ({ payload, type: 'value' }));
}
export function fromCollectionRef(ref) {
    return fromRef(ref).map(payload => ({ payload, type: 'query' }));
}
//# sourceMappingURL=fromRef.js.map