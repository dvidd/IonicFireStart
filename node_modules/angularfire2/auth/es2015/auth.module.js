import { NgModule } from '@angular/core';
import 'firebase/auth';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from './auth';
export function _getAngularFireAuth(app) {
    return new AngularFireAuth(app);
}
export const AngularFireAuthProvider = {
    provide: AngularFireAuth,
    useFactory: _getAngularFireAuth,
    deps: [FirebaseApp]
};
export const AUTH_PROVIDERS = [
    AngularFireAuthProvider,
];
export class AngularFireAuthModule {
}
AngularFireAuthModule.decorators = [
    { type: NgModule, args: [{
                imports: [AngularFireModule],
                providers: [AUTH_PROVIDERS]
            },] },
];
AngularFireAuthModule.ctorParameters = () => [];
//# sourceMappingURL=auth.module.js.map