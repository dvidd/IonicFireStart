import { checkOperationCases } from '../utils';
export function createDataOperationMethod(ref, operation) {
    return function dataOperation(item, value) {
        return checkOperationCases(item, {
            stringCase: () => ref.child(item)[operation](value),
            firebaseCase: () => item[operation](value),
            snapshotCase: () => item.ref[operation](value)
        });
    };
}
//# sourceMappingURL=data-operation.js.map