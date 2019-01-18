import { fromTask } from './observable/fromTask';
import { map } from 'rxjs/operators';
export function createUploadTask(task) {
    const inner$ = fromTask(task);
    return {
        task: task,
        then: task.then.bind(task),
        catch: task.catch.bind(task),
        pause: task.pause.bind(task),
        cancel: task.cancel.bind(task),
        resume: task.resume.bind(task),
        snapshotChanges: () => inner$,
        percentageChanges: () => inner$.pipe(map(s => s.bytesTransferred / s.totalBytes * 100))
    };
}
//# sourceMappingURL=task.js.map