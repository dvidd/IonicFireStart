import { InjectionToken, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
export declare const RealtimeDatabaseURL: InjectionToken<string>;
export declare class FirebaseZoneScheduler {
    zone: NgZone;
    private platformId;
    constructor(zone: NgZone, platformId: Object);
    schedule(...args: any[]): Subscription;
    keepUnstableUntilFirst<T>(obs$: Observable<T>): Observable<T>;
    runOutsideAngular<T>(obs$: Observable<T>): Observable<T>;
}
export declare const runOutsideAngular: (zone: NgZone) => <T>(obs$: Observable<T>) => Observable<T>;
export declare const runInZone: (zone: NgZone) => <T>(obs$: Observable<T>) => Observable<T>;
