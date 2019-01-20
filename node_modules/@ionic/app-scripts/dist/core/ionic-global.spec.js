"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ionic_global_1 = require("./ionic-global");
describe('Ionic Global', function () {
    describe('buildIonicGlobal', function () {
        it('should cache windowIonic', function () {
            var ctx = {
                rootDir: '/Users/elliemae/myapp',
                wwwDir: '/Users/elliemae/myapp/www',
                buildDir: '/Users/elliemae/myapp/www/build'
            };
            var r = ionic_global_1.buildIonicGlobal(ctx);
            expect(r).toBeDefined();
        });
    });
});
