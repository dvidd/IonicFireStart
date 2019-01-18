import { map } from 'rxjs/operators';
import { createObjectSnapshotChanges } from './snapshot-changes';
export function createObjectReference(query, afDatabase) {
    return {
        query,
        snapshotChanges() {
            const snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
        },
        update(data) { return query.ref.update(data); },
        set(data) { return query.ref.set(data); },
        remove() { return query.ref.remove(); },
        valueChanges() {
            const snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(map(action => action.payload.exists() ? action.payload.val() : null));
        },
    };
}
//# sourceMappingURL=create-reference.js.map