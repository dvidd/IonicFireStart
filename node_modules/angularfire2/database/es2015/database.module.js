import { NgModule } from '@angular/core';
import 'firebase/database';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from './database';
export function _getAngularFireDatabase(app) {
    return new AngularFireDatabase(app);
}
export const AngularFireDatabaseProvider = {
    provide: AngularFireDatabase,
    useFactory: _getAngularFireDatabase,
    deps: [FirebaseApp]
};
export const DATABASE_PROVIDERS = [
    AngularFireDatabaseProvider,
];
export class AngularFireDatabaseModule {
}
AngularFireDatabaseModule.decorators = [
    { type: NgModule, args: [{
                imports: [AngularFireModule],
                providers: [DATABASE_PROVIDERS]
            },] },
];
AngularFireDatabaseModule.ctorParameters = () => [];
//# sourceMappingURL=database.module.js.map