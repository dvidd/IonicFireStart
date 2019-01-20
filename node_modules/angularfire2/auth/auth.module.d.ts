import 'firebase/auth';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from './auth';
export declare function _getAngularFireAuth(app: FirebaseApp): AngularFireAuth;
export declare const AngularFireAuthProvider: {
    provide: typeof AngularFireAuth;
    useFactory: (app: FirebaseApp) => AngularFireAuth;
    deps: typeof FirebaseApp[];
};
export declare const AUTH_PROVIDERS: {
    provide: typeof AngularFireAuth;
    useFactory: (app: FirebaseApp) => AngularFireAuth;
    deps: typeof FirebaseApp[];
}[];
export declare class AngularFireAuthModule {
}
