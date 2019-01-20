import { NgModule } from '@angular/core';
import 'firebase/database';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from './database';
export function _getAngularFireDatabase(app) {
    return new AngularFireDatabase(app);
}
export var AngularFireDatabaseProvider = {
    provide: AngularFireDatabase,
    useFactory: _getAngularFireDatabase,
    deps: [FirebaseApp]
};
export var DATABASE_PROVIDERS = [
    AngularFireDatabaseProvider,
];
var AngularFireDatabaseModule = (function () {
    function AngularFireDatabaseModule() {
    }
    AngularFireDatabaseModule.decorators = [
        { type: NgModule, args: [{
                    imports: [AngularFireModule],
                    providers: [DATABASE_PROVIDERS]
                },] },
    ];
    AngularFireDatabaseModule.ctorParameters = function () { return []; };
    return AngularFireDatabaseModule;
}());
export { AngularFireDatabaseModule };
//# sourceMappingURL=database.module.js.map