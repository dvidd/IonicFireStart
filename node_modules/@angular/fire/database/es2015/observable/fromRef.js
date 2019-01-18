import { Observable } from 'rxjs';
import { map, delay, share } from 'rxjs/operators';
export function fromRef(ref, event, listenType = 'on') {
    return new Observable(subscriber => {
        const fn = ref[listenType](event, (snapshot, prevKey) => {
            subscriber.next({ snapshot, prevKey });
            if (listenType == 'once') {
                subscriber.complete();
            }
        }, subscriber.error.bind(subscriber));
        if (listenType == 'on') {
            return { unsubscribe() { ref.off(event, fn); } };
        }
        else {
            return { unsubscribe() { } };
        }
    }).pipe(map(payload => {
        const { snapshot, prevKey } = payload;
        let key = null;
        if (snapshot.exists()) {
            key = snapshot.key;
        }
        return { type: event, payload: snapshot, prevKey, key };
    }), delay(0), share());
}
//# sourceMappingURL=fromRef.js.map