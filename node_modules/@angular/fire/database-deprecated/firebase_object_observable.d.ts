import { Observable, Operator, Subscriber, Subscription } from 'rxjs';
import { database } from 'firebase/app';
export declare class FirebaseObjectObservable<T> extends Observable<T> {
    $ref?: database.Reference | undefined;
    constructor(subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void, $ref?: database.Reference | undefined);
    lift<T, R>(operator: Operator<T, R>): Observable<R>;
    set(value: any): Promise<void>;
    update(value: Object): Promise<void>;
    remove(): Promise<void>;
}
