import { FirebaseAppConfigToken, FirebaseApp, _firebaseAppFactory } from './firebase.app.module';
import { InjectionToken, NgModule } from '@angular/core';
import { queue } from 'rxjs/scheduler/queue';
const FirebaseAppName = new InjectionToken('FirebaseAppName');
export const FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [FirebaseAppConfigToken, FirebaseAppName]
};
export class AngularFireModule {
    static initializeApp(config, appName) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseAppConfigToken, useValue: config },
                { provide: FirebaseAppName, useValue: appName }
            ]
        };
    }
}
AngularFireModule.decorators = [
    { type: NgModule, args: [{
                providers: [FirebaseAppProvider],
            },] },
];
AngularFireModule.ctorParameters = () => [];
export class ZoneScheduler {
    constructor(zone) {
        this.zone = zone;
    }
    schedule(...args) {
        return this.zone.run(() => queue.schedule.apply(queue, args));
    }
}
export { FirebaseApp, FirebaseAppName, FirebaseAppConfigToken };
//# sourceMappingURL=angularfire2.js.map