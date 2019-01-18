import { map } from 'rxjs/operators';
import { createObjectSnapshotChanges } from './snapshot-changes';
export function createObjectReference(query, afDatabase) {
    return {
        query: query,
        snapshotChanges: function () {
            var snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
        },
        update: function (data) { return query.ref.update(data); },
        set: function (data) { return query.ref.set(data); },
        remove: function () { return query.ref.remove(); },
        valueChanges: function () {
            var snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(map(function (action) { return action.payload.exists() ? action.payload.val() : null; }));
        },
    };
}
//# sourceMappingURL=create-reference.js.map