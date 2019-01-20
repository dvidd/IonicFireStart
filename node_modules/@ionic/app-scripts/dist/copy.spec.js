"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var copy = require("./copy");
var config = require("./util/config");
describe('copy task', function () {
    describe('copyConfigToWatchConfig', function () {
        it('should convert to watch config format', function () {
            // arrange
            var context = {};
            var configFile = 'configFile';
            var sampleConfig = {
                copyAssets: {
                    src: ['{{SRC}}/assets/**/*'],
                    dest: '{{WWW}}/assets'
                },
                copyIndexContent: {
                    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
                    dest: '{{WWW}}'
                },
                copyFonts: {
                    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
                    dest: '{{WWW}}/assets/fonts'
                },
                copyPolyfills: {
                    src: ["{{ROOT}}/node_modules/ionic-angular/polyfills/" + process.env.POLLYFILL_NAME + ".js"],
                    dest: '{{BUILD}}'
                },
                someOtherOption: {
                    src: ['{{ROOT}}/whatever'],
                    dest: '{{BUILD}}'
                }
            };
            var combinedSource = [];
            Object.keys(sampleConfig).forEach(function (entry) { return combinedSource = combinedSource.concat(sampleConfig[entry].src); });
            spyOn(config, config.generateContext.name).and.returnValue(context);
            spyOn(config, config.getUserConfigFile.name).and.returnValue(configFile);
            spyOn(config, config.fillConfigDefaults.name).and.returnValue(sampleConfig);
            // act
            var result = copy.copyConfigToWatchConfig(null);
            // assert
            expect(config.generateContext).toHaveBeenCalledWith(null);
            expect(config.getUserConfigFile).toHaveBeenCalledWith(context, copy.taskInfo, '');
            expect(config.fillConfigDefaults).toHaveBeenCalledWith(configFile, copy.taskInfo.defaultConfigFile);
            result.paths.forEach(function (glob) {
                expect(combinedSource.indexOf(glob)).not.toEqual(-1);
            });
            expect(result.callback).toBeDefined();
            expect(result.options).toBeDefined();
        });
    });
});
