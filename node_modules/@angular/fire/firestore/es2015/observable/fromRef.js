import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
function _fromRef(ref) {
    return new Observable(subscriber => {
        const unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe };
    });
}
export function fromRef(ref) {
    return _fromRef(ref).pipe(share());
}
export function fromDocRef(ref) {
    return fromRef(ref)
        .pipe(map(payload => ({ payload, type: 'value' })));
}
export function fromCollectionRef(ref) {
    return fromRef(ref).pipe(map(payload => ({ payload, type: 'query' })));
}
//# sourceMappingURL=fromRef.js.map