import { createUploadTask } from './task';
import { from } from 'rxjs';
export function createStorageRef(ref, scheduler) {
    return {
        getDownloadURL: () => scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(from(scheduler.zone.runOutsideAngular(() => ref.getDownloadURL())))),
        getMetadata: () => scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(from(scheduler.zone.runOutsideAngular(() => ref.getMetadata())))),
        delete: () => from(ref.delete()),
        child: (path) => createStorageRef(ref.child(path), scheduler),
        updateMetatdata: (meta) => from(ref.updateMetadata(meta)),
        put: (data, metadata) => {
            const task = ref.put(data, metadata);
            return createUploadTask(task);
        },
        putString: (data, format, metadata) => {
            const task = ref.putString(data, format, metadata);
            return createUploadTask(task);
        }
    };
}
//# sourceMappingURL=ref.js.map