import { fromCollectionRef } from '../observable/fromRef';
import 'firebase/firestore';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
export function docChanges(query) {
    return fromCollectionRef(query)
        .map(action => action.payload.docChanges
        .map(change => ({ type: change.type, payload: change })));
}
export function sortedChanges(query, events) {
    return fromCollectionRef(query)
        .map(changes => changes.payload.docChanges)
        .scan((current, changes) => combineChanges(current, changes, events), [])
        .map(changes => changes.map(c => ({ type: c.type, payload: c })));
}
export function combineChanges(current, changes, events) {
    changes.forEach(change => {
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
            if (change.oldIndex !== change.newIndex) {
                combined.splice(change.oldIndex, 1);
                combined.splice(change.newIndex, 0, change);
            }
            else {
                combined.splice(change.newIndex, 1, change);
            }
            break;
        case 'removed':
            combined.splice(change.oldIndex, 1);
            break;
    }
    return combined;
}
//# sourceMappingURL=changes.js.map