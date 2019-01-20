import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AFUnwrappedDataSnapshot, FirebaseOperationCases, QueryReference } from './interfaces';
export declare type FirebaseOperation = string | firebase.database.Reference | firebase.database.DataSnapshot | AFUnwrappedDataSnapshot;
export declare class FirebaseListObservable<T> extends Observable<T> {
    $ref: QueryReference;
    constructor($ref: QueryReference, subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void);
    lift<T, R>(operator: Operator<T, R>): Observable<R>;
    push(val: any): firebase.database.ThenableReference;
    set(item: FirebaseOperation, value: Object): Promise<void>;
    update(item: FirebaseOperation, value: Object): Promise<void>;
    remove(item?: FirebaseOperation): Promise<void>;
    protected _checkOperationCases(item: FirebaseOperation, cases: FirebaseOperationCases): Promise<void>;
}
