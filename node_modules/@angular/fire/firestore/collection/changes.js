import { fromCollectionRef } from '../observable/fromRef';
import { map, scan } from 'rxjs/operators';
export function docChanges(query) {
    return fromCollectionRef(query)
        .pipe(map(function (action) {
        return action.payload.docChanges()
            .map(function (change) { return ({ type: change.type, payload: change }); });
    }));
}
export function sortedChanges(query, events) {
    return fromCollectionRef(query)
        .pipe(map(function (changes) { return changes.payload.docChanges(); }), scan(function (current, changes) { return combineChanges(current, changes, events); }, []), map(function (changes) { return changes.map(function (c) { return ({ type: c.type, payload: c }); }); }));
}
export function combineChanges(current, changes, events) {
    changes.forEach(function (change) {
        if (events.indexOf(change.type) > -1) {
            current = combineChange(current, change);
        }
    });
    return current;
}
export function combineChange(combined, change) {
    switch (change.type) {
        case 'added':
            if (combined[change.newIndex] && combined[change.newIndex].doc.id == change.doc.id) {
            }
            else {
                combined.splice(change.newIndex, 0, change);
            }
            break;
        case 'modified':
            if (combined[change.oldIndex] == null || combined[change.oldIndex].doc.id == change.doc.id) {
                if (change.oldIndex !== change.newIndex) {
                    combined.splice(change.oldIndex, 1);
                    combined.splice(change.newIndex, 0, change);
                }
                else {
                    combined.splice(change.newIndex, 1, change);
                }
            }
            break;
        case 'removed':
            if (combined[change.oldIndex] && combined[change.oldIndex].doc.id == change.doc.id) {
                combined.splice(change.oldIndex, 1);
            }
            break;
    }
    return combined;
}
//# sourceMappingURL=changes.js.map