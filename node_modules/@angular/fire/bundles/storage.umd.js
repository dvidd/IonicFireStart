(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/fire'), require('firebase/storage')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/fire', 'firebase/storage'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.storage = {}),global.rxjs,global.rxjs.operators,global.ng.core,global.angularfire2));
}(this, (function (exports,rxjs,operators,core,fire) { 'use strict';

    function fromTask(task) {
        return new rxjs.Observable(function (subscriber) {
            var progress = function (snap) { return subscriber.next(snap); };
            var error = function (e) { return subscriber.error(e); };
            var complete = function () { return subscriber.complete(); };
            task.on('state_changed', progress, error, complete);
            return function () { return task.cancel(); };
        });
    }

    function createUploadTask(task) {
        var inner$ = fromTask(task);
        return {
            task: task,
            then: task.then.bind(task),
            catch: task.catch.bind(task),
            pause: task.pause.bind(task),
            cancel: task.cancel.bind(task),
            resume: task.resume.bind(task),
            snapshotChanges: function () { return inner$; },
            percentageChanges: function () { return inner$.pipe(operators.map(function (s) { return s.bytesTransferred / s.totalBytes * 100; })); }
        };
    }

    function createStorageRef(ref, scheduler) {
        return {
            getDownloadURL: function () { return scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(rxjs.from(scheduler.zone.runOutsideAngular(function () { return ref.getDownloadURL(); })))); },
            getMetadata: function () { return scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(rxjs.from(scheduler.zone.runOutsideAngular(function () { return ref.getMetadata(); })))); },
            delete: function () { return rxjs.from(ref.delete()); },
            child: function (path) { return createStorageRef(ref.child(path), scheduler); },
            updateMetatdata: function (meta) { return rxjs.from(ref.updateMetadata(meta)); },
            put: function (data, metadata) {
                var task = ref.put(data, metadata);
                return createUploadTask(task);
            },
            putString: function (data, format, metadata) {
                var task = ref.putString(data, format, metadata);
                return createUploadTask(task);
            }
        };
    }

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var StorageBucket = new core.InjectionToken('angularfire2.storageBucket');
    var AngularFireStorage = (function () {
        function AngularFireStorage(options, nameOrConfig, storageBucket, platformId, zone) {
            this.scheduler = new fire.FirebaseZoneScheduler(zone, platformId);
            this.storage = zone.runOutsideAngular(function () {
                var app = fire._firebaseAppFactory(options, nameOrConfig);
                return app.storage(storageBucket || undefined);
            });
        }
        AngularFireStorage.prototype.ref = function (path) {
            return createStorageRef(this.storage.ref(path), this.scheduler);
        };
        AngularFireStorage.prototype.upload = function (path, data, metadata) {
            var storageRef = this.storage.ref(path);
            var ref = createStorageRef(storageRef, this.scheduler);
            return ref.put(data, metadata);
        };
        AngularFireStorage = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Optional()), __param(2, core.Inject(StorageBucket)),
            __param(3, core.Inject(core.PLATFORM_ID)),
            __metadata("design:paramtypes", [Object, Object, String, Object,
                core.NgZone])
        ], AngularFireStorage);
        return AngularFireStorage;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFireStorageModule = (function () {
        function AngularFireStorageModule() {
        }
        AngularFireStorageModule = __decorate$1([
            core.NgModule({
                providers: [AngularFireStorage]
            })
        ], AngularFireStorageModule);
        return AngularFireStorageModule;
    }());

    exports.createStorageRef = createStorageRef;
    exports.StorageBucket = StorageBucket;
    exports.AngularFireStorage = AngularFireStorage;
    exports.createUploadTask = createUploadTask;
    exports.fromTask = fromTask;
    exports.AngularFireStorageModule = AngularFireStorageModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
