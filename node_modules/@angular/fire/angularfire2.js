import { InjectionToken } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, queueScheduler as queue } from 'rxjs';
export var RealtimeDatabaseURL = new InjectionToken('angularfire2.realtimeDatabaseURL');
var FirebaseZoneScheduler = (function () {
    function FirebaseZoneScheduler(zone, platformId) {
        this.zone = zone;
        this.platformId = platformId;
    }
    FirebaseZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.runGuarded(function () { return queue.schedule.apply(queue, args); });
    };
    FirebaseZoneScheduler.prototype.keepUnstableUntilFirst = function (obs$) {
        if (isPlatformServer(this.platformId)) {
            return new Observable(function (subscriber) {
                var noop = function () { };
                var task = Zone.current.scheduleMacroTask('firebaseZoneBlock', noop, {}, noop, noop);
                obs$.subscribe(function (next) {
                    if (task.state === 'scheduled') {
                        task.invoke();
                    }
                    ;
                    subscriber.next(next);
                }, function (error) {
                    if (task.state === 'scheduled') {
                        task.invoke();
                    }
                    subscriber.error(error);
                }, function () {
                    if (task.state === 'scheduled') {
                        task.invoke();
                    }
                    subscriber.complete();
                });
            });
        }
        else {
            return obs$;
        }
    };
    FirebaseZoneScheduler.prototype.runOutsideAngular = function (obs$) {
        var _this = this;
        return new Observable(function (subscriber) {
            return _this.zone.runOutsideAngular(function () {
                return obs$.subscribe(function (value) { return _this.zone.run(function () { return subscriber.next(value); }); }, function (error) { return _this.zone.run(function () { return subscriber.error(error); }); }, function () { return _this.zone.run(function () { return subscriber.complete(); }); });
            });
        });
    };
    return FirebaseZoneScheduler;
}());
export { FirebaseZoneScheduler };
export var runOutsideAngular = function (zone) { return function (obs$) {
    return new Observable(function (subscriber) {
        return zone.runOutsideAngular(function () {
            runInZone(zone)(obs$).subscribe(subscriber);
        });
    });
}; };
export var runInZone = function (zone) { return function (obs$) {
    return new Observable(function (subscriber) {
        return obs$.subscribe(function (value) { return zone.run(function () { return subscriber.next(value); }); }, function (error) { return zone.run(function () { return subscriber.error(error); }); }, function () { return zone.run(function () { return subscriber.complete(); }); });
    });
}; };
//# sourceMappingURL=angularfire2.js.map