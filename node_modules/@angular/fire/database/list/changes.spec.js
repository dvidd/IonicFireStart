var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { FirebaseApp, AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireDatabaseModule, listChanges } from '@angular/fire/database';
import { TestBed, inject } from '@angular/core/testing';
import { COMMON_CONFIG } from '../test-config';
import { skip, take } from 'rxjs/operators';
var rando = function () { return (Math.random() + 1).toString(36).substring(7); };
var FIREBASE_APP_NAME = rando();
describe('listChanges', function () {
    var app;
    var db;
    var ref;
    var batch = {};
    var items = [{ name: 'zero' }, { name: 'one' }, { name: 'two' }].map(function (item, i) { return (__assign({ key: i.toString() }, item)); });
    Object.keys(items).forEach(function (key, i) {
        var itemValue = items[key];
        batch[i] = itemValue;
    });
    batch = Object.freeze(batch);
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [
                AngularFireModule.initializeApp(COMMON_CONFIG, FIREBASE_APP_NAME),
                AngularFireDatabaseModule
            ]
        });
        inject([FirebaseApp, AngularFireDatabase], function (app_, _db) {
            app = app_;
            db = _db;
            app.database().goOffline();
            ref = function (path) { app.database().goOffline(); return app.database().ref(path); };
        })();
    });
    afterEach(function (done) {
        app.delete().then(done, done.fail);
    });
    describe('events', function () {
        it('should stream value at first', function (done) {
            var someRef = ref(rando());
            var obs = listChanges(someRef, ['child_added']);
            var sub = obs.pipe(take(1)).subscribe(function (changes) {
                var data = changes.map(function (change) { return change.payload.val(); });
                expect(data).toEqual(items);
            }).add(done);
            someRef.set(batch);
        });
        it('should process a new child_added event', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref, ['child_added']);
            var sub = obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var data = changes.map(function (change) { return change.payload.val(); });
                expect(data[3]).toEqual({ name: 'anotha one' });
            }).add(done);
            aref.set(batch);
            aref.push({ name: 'anotha one' });
        });
        it('should stream in order events', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref.orderByChild('name'), ['child_added']);
            var sub = obs.pipe(take(1)).subscribe(function (changes) {
                var names = changes.map(function (change) { return change.payload.val().name; });
                expect(names[0]).toEqual('one');
                expect(names[1]).toEqual('two');
                expect(names[2]).toEqual('zero');
            }).add(done);
            aref.set(batch);
        });
        it('should stream in order events w/child_added', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref.orderByChild('name'), ['child_added']);
            var sub = obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var names = changes.map(function (change) { return change.payload.val().name; });
                expect(names[0]).toEqual('anotha one');
                expect(names[1]).toEqual('one');
                expect(names[2]).toEqual('two');
                expect(names[3]).toEqual('zero');
            }).add(done);
            aref.set(batch);
            aref.push({ name: 'anotha one' });
        });
        it('should stream events filtering', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref.orderByChild('name').equalTo('zero'), ['child_added']);
            obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var names = changes.map(function (change) { return change.payload.val().name; });
                expect(names[0]).toEqual('zero');
                expect(names[1]).toEqual('zero');
            }).add(done);
            aref.set(batch);
            aref.push({ name: 'zero' });
        });
        it('should process a new child_removed event', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref, ['child_added', 'child_removed']);
            var sub = obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var data = changes.map(function (change) { return change.payload.val(); });
                expect(data.length).toEqual(items.length - 1);
            }).add(done);
            app.database().goOnline();
            aref.set(batch).then(function () {
                aref.child(items[0].key).remove();
            });
        });
        it('should process a new child_changed event', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref, ['child_added', 'child_changed']);
            var sub = obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var data = changes.map(function (change) { return change.payload.val(); });
                expect(data[1].name).toEqual('lol');
            }).add(done);
            app.database().goOnline();
            aref.set(batch).then(function () {
                aref.child(items[1].key).update({ name: 'lol' });
            });
        });
        it('should process a new child_moved event', function (done) {
            var aref = ref(rando());
            var obs = listChanges(aref, ['child_added', 'child_moved']);
            var sub = obs.pipe(skip(1), take(1)).subscribe(function (changes) {
                var data = changes.map(function (change) { return change.payload.val(); });
                expect(data[data.length - 1]).toEqual(items[0]);
            }).add(done);
            app.database().goOnline();
            aref.set(batch).then(function () {
                aref.child(items[0].key).setPriority('a', function () { });
            });
        });
    });
});
//# sourceMappingURL=changes.spec.js.map