import { Observable } from 'rxjs';
export function fromTask(task) {
    return new Observable(function (subscriber) {
        var progress = function (snap) { return subscriber.next(snap); };
        var error = function (e) { return subscriber.error(e); };
        var complete = function () { return subscriber.complete(); };
        task.on('state_changed', progress, error, complete);
        return function () { return task.cancel(); };
    });
}
//# sourceMappingURL=fromTask.js.map