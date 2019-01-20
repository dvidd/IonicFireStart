import { createObjectSnapshotChanges } from './snapshot-changes';
export function createObjectReference(query) {
    return {
        query: query,
        snapshotChanges: createObjectSnapshotChanges(query),
        update: function (data) { return query.ref.update(data); },
        set: function (data) { return query.ref.set(data); },
        remove: function () { return query.ref.remove(); },
        valueChanges: function () {
            return createObjectSnapshotChanges(query)()
                .map(function (action) { return action.payload.exists() ? action.payload.val() : null; });
        },
    };
}
//# sourceMappingURL=create-reference.js.map