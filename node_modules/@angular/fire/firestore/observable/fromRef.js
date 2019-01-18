import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
function _fromRef(ref) {
    return new Observable(function (subscriber) {
        var unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe: unsubscribe };
    });
}
export function fromRef(ref) {
    return _fromRef(ref).pipe(share());
}
export function fromDocRef(ref) {
    return fromRef(ref)
        .pipe(map(function (payload) { return ({ payload: payload, type: 'value' }); }));
}
export function fromCollectionRef(ref) {
    return fromRef(ref).pipe(map(function (payload) { return ({ payload: payload, type: 'query' }); }));
}
//# sourceMappingURL=fromRef.js.map