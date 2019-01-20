import { FirebaseObjectObservable } from './firebase_object_observable';
import { ZoneScheduler } from 'angularfire2';
import { observeOn } from 'rxjs/operator/observeOn';
import 'firebase/database';
import * as utils from './utils';
export function FirebaseObjectFactory(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var objectObservable = new FirebaseObjectObservable(function (obs) {
        var fn = ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : utils.unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off('value', fn); };
    }, ref);
    return observeOn.call(objectObservable, new ZoneScheduler(Zone.current));
}
//# sourceMappingURL=firebase_object_factory.js.map