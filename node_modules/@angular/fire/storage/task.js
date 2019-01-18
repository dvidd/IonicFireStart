import { fromTask } from './observable/fromTask';
import { map } from 'rxjs/operators';
export function createUploadTask(task) {
    var inner$ = fromTask(task);
    return {
        task: task,
        then: task.then.bind(task),
        catch: task.catch.bind(task),
        pause: task.pause.bind(task),
        cancel: task.cancel.bind(task),
        resume: task.resume.bind(task),
        snapshotChanges: function () { return inner$; },
        percentageChanges: function () { return inner$.pipe(map(function (s) { return s.bytesTransferred / s.totalBytes * 100; })); }
    };
}
//# sourceMappingURL=task.js.map