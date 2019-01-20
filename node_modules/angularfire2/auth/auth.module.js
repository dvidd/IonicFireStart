import { NgModule } from '@angular/core';
import 'firebase/auth';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from './auth';
export function _getAngularFireAuth(app) {
    return new AngularFireAuth(app);
}
export var AngularFireAuthProvider = {
    provide: AngularFireAuth,
    useFactory: _getAngularFireAuth,
    deps: [FirebaseApp]
};
export var AUTH_PROVIDERS = [
    AngularFireAuthProvider,
];
var AngularFireAuthModule = (function () {
    function AngularFireAuthModule() {
    }
    AngularFireAuthModule.decorators = [
        { type: NgModule, args: [{
                    imports: [AngularFireModule],
                    providers: [AUTH_PROVIDERS]
                },] },
    ];
    AngularFireAuthModule.ctorParameters = function () { return []; };
    return AngularFireAuthModule;
}());
export { AngularFireAuthModule };
//# sourceMappingURL=auth.module.js.map