import { checkOperationCases } from '../utils';
export function createRemoveMethod(ref) {
    return function remove(item) {
        if (!item) {
            return ref.remove();
        }
        return checkOperationCases(item, {
            stringCase: () => ref.child(item).remove(),
            firebaseCase: () => item.remove(),
            snapshotCase: () => item.ref.remove()
        });
    };
}
//# sourceMappingURL=remove.js.map