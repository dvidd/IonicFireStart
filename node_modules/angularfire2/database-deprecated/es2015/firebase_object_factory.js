import { FirebaseObjectObservable } from './firebase_object_observable';
import { ZoneScheduler } from 'angularfire2';
import { observeOn } from 'rxjs/operator/observeOn';
import 'firebase/database';
import * as utils from './utils';
export function FirebaseObjectFactory(ref, { preserveSnapshot } = {}) {
    const objectObservable = new FirebaseObjectObservable((obs) => {
        let fn = ref.on('value', (snapshot) => {
            obs.next(preserveSnapshot ? snapshot : utils.unwrapMapFn(snapshot));
        }, err => {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return () => ref.off('value', fn);
    }, ref);
    return observeOn.call(objectObservable, new ZoneScheduler(Zone.current));
}
//# sourceMappingURL=firebase_object_factory.js.map