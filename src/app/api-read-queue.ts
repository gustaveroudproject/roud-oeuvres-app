import { asyncScheduler, defer, Observable, SchedulerLike, Subscription } from 'rxjs';

/** Space read starts across the shared connection, preserving cancellation/errors. */
export class ApiReadQueue {
    private pending: Array<{ start: () => void }> = [];
    private timer: Subscription | undefined;
    private nextStart = 0;

    constructor(private intervalMs = 250, private clock: SchedulerLike = asyncScheduler) {}

    wrap<T, A extends unknown[]>(read: (...args: A) => Observable<T>): (...args: A) => Observable<T> {
        return (...args: A) => new Observable<T>(subscriber => {
            let request: Subscription | undefined;
            const task = { start: () => { request = defer(() => read(...args)).subscribe(subscriber); } };
            this.pending.push(task);
            this.schedule();
            return () => {
                this.pending = this.pending.filter(item => item !== task);
                request?.unsubscribe();
                if (this.pending.length === 0) {
                    this.timer?.unsubscribe();
                    this.timer = undefined;
                }
            };
        });
    }

    private schedule(): void {
        if (this.timer || this.pending.length === 0) return;
        this.timer = this.clock.schedule(() => {
            this.timer = undefined;
            const task = this.pending.shift();
            if (task) {
                this.nextStart = this.clock.now() + this.intervalMs;
                task.start();
            }
            this.schedule();
        }, Math.max(0, this.nextStart - this.clock.now()));
    }
}
