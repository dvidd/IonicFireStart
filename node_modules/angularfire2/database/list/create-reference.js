import { snapshotChanges } from './snapshot-changes';
import { createStateChanges } from './state-changes';
import { createAuditTrail } from './audit-trail';
import { createDataOperationMethod } from './data-operation';
import { createRemoveMethod } from './remove';
export function createListReference(query) {
    return {
        query: query,
        update: createDataOperationMethod(query.ref, 'update'),
        set: createDataOperationMethod(query.ref, 'set'),
        push: function (data) { return query.ref.push(data); },
        remove: createRemoveMethod(query.ref),
        snapshotChanges: function (events) {
            return snapshotChanges(query, events);
        },
        stateChanges: createStateChanges(query),
        auditTrail: createAuditTrail(query),
        valueChanges: function (events) {
            return snapshotChanges(query, events)
                .map(function (actions) { return actions.map(function (a) { return a.payload.val(); }); });
        }
    };
}
//# sourceMappingURL=create-reference.js.map