import { createObjectSnapshotChanges } from './snapshot-changes';
export function createObjectReference(query) {
    return {
        query,
        snapshotChanges: createObjectSnapshotChanges(query),
        update(data) { return query.ref.update(data); },
        set(data) { return query.ref.set(data); },
        remove() { return query.ref.remove(); },
        valueChanges() {
            return createObjectSnapshotChanges(query)()
                .map(action => action.payload.exists() ? action.payload.val() : null);
        },
    };
}
//# sourceMappingURL=create-reference.js.map