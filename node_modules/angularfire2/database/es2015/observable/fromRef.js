import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { ZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
export function fromRef(ref, event, listenType = 'on') {
    const ref$ = new Observable(subscriber => {
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
    })
        .map((payload) => {
        const { snapshot, prevKey } = payload;
        let key = null;
        if (snapshot.exists()) {
            key = snapshot.key;
        }
        return { type: event, payload: snapshot, prevKey, key };
    })
        .delay(0);
    return observeOn.call(ref$, new ZoneScheduler(Zone.current)).share();
}
//# sourceMappingURL=fromRef.js.map