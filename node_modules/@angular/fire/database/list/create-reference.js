import { snapshotChanges } from './snapshot-changes';
import { stateChanges } from './state-changes';
import { auditTrail } from './audit-trail';
import { createDataOperationMethod } from './data-operation';
import { createRemoveMethod } from './remove';
import { map } from 'rxjs/operators';
export function createListReference(query, afDatabase) {
    return {
        query: query,
        update: createDataOperationMethod(query.ref, 'update'),
        set: createDataOperationMethod(query.ref, 'set'),
        push: function (data) { return query.ref.push(data); },
        remove: createRemoveMethod(query.ref),
        snapshotChanges: function (events) {
            var snapshotChanges$ = snapshotChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
        },
        stateChanges: function (events) {
            var stateChanges$ = stateChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(stateChanges$));
        },
        auditTrail: function (events) {
            var auditTrail$ = auditTrail(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(auditTrail$));
        },
        valueChanges: function (events) {
            var snapshotChanges$ = snapshotChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(map(function (actions) { return actions.map(function (a) { return a.payload.val(); }); }));
        }
    };
}
//# sourceMappingURL=create-reference.js.map