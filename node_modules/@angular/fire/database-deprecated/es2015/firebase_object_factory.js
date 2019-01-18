import { NgZone } from '@angular/core';
import { FirebaseObjectObservable } from './firebase_object_observable';
import { FirebaseZoneScheduler } from '@angular/fire';
import { observeOn } from 'rxjs/operators';
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
    return observeOn.call(objectObservable, new FirebaseZoneScheduler(new NgZone({}), {}));
}
//# sourceMappingURL=firebase_object_factory.js.map