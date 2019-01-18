import { Observable } from 'rxjs';
export function fromTask(task) {
    return new Observable(subscriber => {
        const progress = (snap) => subscriber.next(snap);
        const error = e => subscriber.error(e);
        const complete = () => subscriber.complete();
        task.on('state_changed', progress, error, complete);
        return () => task.cancel();
    });
}
//# sourceMappingURL=fromTask.js.map