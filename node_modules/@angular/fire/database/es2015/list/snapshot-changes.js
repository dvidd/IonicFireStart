import { listChanges } from './changes';
import { validateEventsArray } from './utils';
export function snapshotChanges(query, events) {
    events = validateEventsArray(events);
    return listChanges(query, events);
}
//# sourceMappingURL=snapshot-changes.js.map