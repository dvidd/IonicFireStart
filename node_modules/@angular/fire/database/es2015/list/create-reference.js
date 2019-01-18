import { snapshotChanges } from './snapshot-changes';
import { stateChanges } from './state-changes';
import { auditTrail } from './audit-trail';
import { createDataOperationMethod } from './data-operation';
import { createRemoveMethod } from './remove';
import { map } from 'rxjs/operators';
export function createListReference(query, afDatabase) {
    return {
        query,
        update: createDataOperationMethod(query.ref, 'update'),
        set: createDataOperationMethod(query.ref, 'set'),
        push: (data) => query.ref.push(data),
        remove: createRemoveMethod(query.ref),
        snapshotChanges(events) {
            const snapshotChanges$ = snapshotChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
        },
        stateChanges(events) {
            const stateChanges$ = stateChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(stateChanges$));
        },
        auditTrail(events) {
            const auditTrail$ = auditTrail(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(auditTrail$));
        },
        valueChanges(events) {
            const snapshotChanges$ = snapshotChanges(query, events);
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(map(actions => actions.map(a => a.payload.val())));
        }
    };
}
//# sourceMappingURL=create-reference.js.map