import { fromRef } from '../observable/fromRef';
export function createObjectSnapshotChanges(query) {
    return function snapshotChanges() {
        return fromRef(query, 'value');
    };
}
//# sourceMappingURL=snapshot-changes.js.map