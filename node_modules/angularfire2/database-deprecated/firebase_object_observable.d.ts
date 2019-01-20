import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';
import 'firebase/database';
export declare class FirebaseObjectObservable<T> extends Observable<T> {
    $ref: firebase.database.Reference | undefined;
    constructor(subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void, $ref?: firebase.database.Reference | undefined);
    lift<T, R>(operator: Operator<T, R>): Observable<R>;
    set(value: any): Promise<void>;
    update(value: Object): Promise<void>;
    remove(): Promise<void>;
}
