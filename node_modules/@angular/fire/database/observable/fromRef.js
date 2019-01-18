import { Observable } from 'rxjs';
import { map, delay, share } from 'rxjs/operators';
export function fromRef(ref, event, listenType) {
    if (listenType === void 0) { listenType = 'on'; }
    return new Observable(function (subscriber) {
        var fn = ref[listenType](event, function (snapshot, prevKey) {
            subscriber.next({ snapshot: snapshot, prevKey: prevKey });
            if (listenType == 'once') {
                subscriber.complete();
            }
        }, subscriber.error.bind(subscriber));
        if (listenType == 'on') {
            return { unsubscribe: function () { ref.off(event, fn); } };
        }
        else {
            return { unsubscribe: function () { } };
        }
    }).pipe(map(function (payload) {
        var snapshot = payload.snapshot, prevKey = payload.prevKey;
        var key = null;
        if (snapshot.exists()) {
            key = snapshot.key;
        }
        return { type: event, payload: snapshot, prevKey: prevKey, key: key };
    }), delay(0), share());
}
//# sourceMappingURL=fromRef.js.map