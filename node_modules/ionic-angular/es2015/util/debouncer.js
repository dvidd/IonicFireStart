export class TimeoutDebouncer {
    constructor(wait) {
        this.wait = wait;
        this.timer = null;
    }
    debounce(callback) {
        this.callback = callback;
        this.schedule();
    }
    schedule() {
        this.cancel();
        if (this.wait <= 0) {
            this.callback();
        }
        else {
            this.timer = setTimeout(this.callback, this.wait);
        }
    }
    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
//# sourceMappingURL=debouncer.js.map