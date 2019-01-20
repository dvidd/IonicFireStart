import { snapshotChanges } from './snapshot-changes';
import { createStateChanges } from './state-changes';
import { createAuditTrail } from './audit-trail';
import { createDataOperationMethod } from './data-operation';
import { createRemoveMethod } from './remove';
export function createListReference(query) {
    return {
        query,
        update: createDataOperationMethod(query.ref, 'update'),
        set: createDataOperationMethod(query.ref, 'set'),
        push: (data) => query.ref.push(data),
        remove: createRemoveMethod(query.ref),
        snapshotChanges(events) {
            return snapshotChanges(query, events);
        },
        stateChanges: createStateChanges(query),
        auditTrail: createAuditTrail(query),
        valueChanges(events) {
            return snapshotChanges(query, events)
                .map(actions => actions.map(a => a.payload.val()));
        }
    };
}
//# sourceMappingURL=create-reference.js.map