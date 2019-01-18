import { checkOperationCases } from '../utils';
export function createDataOperationMethod(ref, operation) {
    return function dataOperation(item, value) {
        return checkOperationCases(item, {
            stringCase: function () { return ref.child(item)[operation](value); },
            firebaseCase: function () { return item[operation](value); },
            snapshotCase: function () { return item.ref[operation](value); }
        });
    };
}
//# sourceMappingURL=data-operation.js.map