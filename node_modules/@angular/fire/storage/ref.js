import { createUploadTask } from './task';
import { from } from 'rxjs';
export function createStorageRef(ref, scheduler) {
    return {
        getDownloadURL: function () { return scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(from(scheduler.zone.runOutsideAngular(function () { return ref.getDownloadURL(); })))); },
        getMetadata: function () { return scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(from(scheduler.zone.runOutsideAngular(function () { return ref.getMetadata(); })))); },
        delete: function () { return from(ref.delete()); },
        child: function (path) { return createStorageRef(ref.child(path), scheduler); },
        updateMetatdata: function (meta) { return from(ref.updateMetadata(meta)); },
        put: function (data, metadata) {
            var task = ref.put(data, metadata);
            return createUploadTask(task);
        },
        putString: function (data, format, metadata) {
            var task = ref.putString(data, format, metadata);
            return createUploadTask(task);
        }
    };
}
//# sourceMappingURL=ref.js.map