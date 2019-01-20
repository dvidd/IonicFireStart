import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
export interface FirebaseOperationCases {
    stringCase: () => Promise<void>;
    firebaseCase?: () => Promise<void>;
    snapshotCase?: () => Promise<void>;
    unwrappedSnapshotCase?: () => Promise<void>;
}
export interface AFUnwrappedDataSnapshot {
    $key: string;
    $value?: string | number | boolean;
    $exists: () => boolean;
}
export interface Query {
    [key: string]: any;
    orderByKey?: boolean | Observable<boolean>;
    orderByPriority?: boolean | Observable<boolean>;
    orderByChild?: string | Observable<string>;
    orderByValue?: boolean | Observable<boolean>;
    equalTo?: any | Observable<any>;
    startAt?: any | Observable<any>;
    endAt?: any | Observable<any>;
    limitToFirst?: number | Observable<number>;
    limitToLast?: number | Observable<number>;
}
export interface ScalarQuery {
    [key: string]: any;
    orderByKey?: boolean;
    orderByPriority?: boolean;
    orderByChild?: string;
    orderByValue?: boolean;
    equalTo?: any;
    startAt?: any;
    endAt?: any;
    limitToFirst?: number;
    limitToLast?: number;
}
export interface OrderBySelection {
    key: OrderByOptions;
    value: boolean | string;
}
export interface LimitToSelection {
    key: LimitToOptions;
    value: number;
}
export interface FirebaseListFactoryOpts {
    preserveSnapshot?: boolean;
    query?: Query;
}
export interface FirebaseObjectFactoryOpts {
    preserveSnapshot?: boolean;
}
export declare enum OrderByOptions {
    Child = 0,
    Key = 1,
    Value = 2,
    Priority = 3,
}
export declare enum LimitToOptions {
    First = 0,
    Last = 1,
}
export declare enum QueryOptions {
    EqualTo = 0,
    StartAt = 1,
    EndAt = 2,
}
export declare type Primitive = number | string | boolean;
export declare type DatabaseSnapshot = firebase.database.DataSnapshot;
export declare type DatabaseReference = firebase.database.Reference;
export declare type DatabaseQuery = firebase.database.Query;
export declare type QueryReference = DatabaseReference | DatabaseQuery;
export declare type PathReference = QueryReference | string;
