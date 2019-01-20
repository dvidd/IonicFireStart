"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var build = require("./build");
var interfaces_1 = require("./util/interfaces");
var file_cache_1 = require("./util/file-cache");
var watch = require("./watch");
describe('watch', function () {
    describe('runBuildUpdate', function () {
        it('should require transpile full build for html file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for html file change and not already successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require template update for html file change and already successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            watch.runBuildUpdate(context, files);
            expect(context.templateState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for ts file unlink', function () {
            var files = [{
                    event: 'unlink',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for ts file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for scss file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for scss file change', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile full build for single ts add, but only bundle update when already successful bundle', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile full build for single ts add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for single ts change and not in file cache', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile update only and full bundle build for single ts change and already in file cache and hasnt already had successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            var resolvedFilePath = path_1.resolve('file1.ts');
            context.fileCache.set(resolvedFilePath, { path: 'file1.ts', content: 'content' });
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile update only and bundle update for single ts change and already in file cache and bundle already successful', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            var resolvedFilePath = path_1.resolve('file1.ts');
            context.fileCache.set(resolvedFilePath, { path: 'file1.ts', content: 'content' });
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for multiple ts changes', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }, {
                    event: 'change',
                    filePath: 'file2.ts',
                    ext: '.ts'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.deepLinkState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should not update bundle state if no transpile changes', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch.runBuildUpdate(context, files);
            expect(context.bundleState).toEqual(undefined);
        });
        it('should do nothing if there are no changed files', function () {
            expect(watch.runBuildUpdate(context, [])).toEqual(null);
            expect(watch.runBuildUpdate(context, null)).toEqual(null);
        });
        var context;
        beforeEach(function () {
            context = {
                fileCache: new file_cache_1.FileCache()
            };
        });
    });
    describe('prepareWatcher', function () {
        it('should do nothing when options.ignored is a function', function () {
            var ignoreFn = function () { };
            var watcher = { options: { ignored: ignoreFn } };
            var context = { srcDir: '/some/src/' };
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.ignored).toBe(ignoreFn);
        });
        it('should set replacePathVars when options.ignored is a string', function () {
            var watcher = { options: { ignored: path_1.join('{{SRC}}', '**', '*.spec.ts') } };
            var context = { srcDir: path_1.join(process.cwd(), 'some', 'src') };
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.ignored).toEqual(path_1.join(process.cwd(), 'some', 'src', '**', '*.spec.ts'));
        });
        it('should set replacePathVars when options.ignored is an array of strings', function () {
            var watcher = { options: { ignored: [path_1.join('{{SRC}}', '**', '*.spec.ts'), path_1.join('{{SRC}}', 'index.html')] } };
            var context = { srcDir: path_1.join(process.cwd(), 'some', 'src') };
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.ignored[0]).toEqual(path_1.join(process.cwd(), 'some', 'src', '**', '*.spec.ts'));
            expect(watcher.options.ignored[1]).toEqual(path_1.join(process.cwd(), 'some', 'src', 'index.html'));
        });
        it('should set replacePathVars when paths is an array', function () {
            var watcher = { paths: [
                    path_1.join('{{SRC}}', 'some', 'path1'),
                    path_1.join('{{SRC}}', 'some', 'path2')
                ] };
            var context = { srcDir: path_1.join(process.cwd(), 'some', 'src') };
            watch.prepareWatcher(context, watcher);
            expect(watcher.paths.length).toEqual(2);
            expect(watcher.paths[0]).toEqual(path_1.join(process.cwd(), 'some', 'src', 'some', 'path1'));
            expect(watcher.paths[1]).toEqual(path_1.join(process.cwd(), 'some', 'src', 'some', 'path2'));
        });
        it('should set replacePathVars when paths is a string', function () {
            var watcher = { paths: path_1.join('{{SRC}}', 'some', 'path') };
            var context = { srcDir: path_1.join(process.cwd(), 'some', 'src') };
            watch.prepareWatcher(context, watcher);
            expect(watcher.paths).toEqual(path_1.join(process.cwd(), 'some', 'src', 'some', 'path'));
        });
        it('should not set options.ignoreInitial if it was provided', function () {
            var watcher = { options: { ignoreInitial: false } };
            var context = {};
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.ignoreInitial).toEqual(false);
        });
        it('should set options.ignoreInitial to true if it wasnt provided', function () {
            var watcher = { options: {} };
            var context = {};
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.ignoreInitial).toEqual(true);
        });
        it('should not set options.cwd from context.rootDir if it was provided', function () {
            var watcher = { options: { cwd: '/my/cwd/' } };
            var context = { rootDir: '/my/root/dir/' };
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.cwd).toEqual('/my/cwd/');
        });
        it('should set options.cwd from context.rootDir if it wasnt provided', function () {
            var watcher = {};
            var context = { rootDir: '/my/root/dir/' };
            watch.prepareWatcher(context, watcher);
            expect(watcher.options.cwd).toEqual(context.rootDir);
        });
        it('should create watcher options when not provided', function () {
            var watcher = {};
            var context = {};
            watch.prepareWatcher(context, watcher);
            expect(watcher.options).toBeDefined();
        });
    });
    describe('queueOrRunBuildUpdate', function () {
        it('should not queue a build when there isnt an active build', function () {
            var changedFileOne = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter.ts'
            };
            var changedFileTwo = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter2.ts'
            };
            var changedFiles = [changedFileOne, changedFileTwo];
            var context = {};
            spyOn(watch, watch.queueOrRunBuildUpdate.name).and.callThrough();
            spyOn(build, build.buildUpdate.name).and.returnValue(Promise.resolve());
            var promise = watch.queueOrRunBuildUpdate(changedFiles, context);
            return promise.then(function () {
                expect(watch.queueOrRunBuildUpdate).toHaveBeenCalledTimes(1);
                expect(build.buildUpdate).toHaveBeenCalledWith(changedFiles, context);
                expect(watch.buildUpdatePromise).toEqual(null);
                expect(watch.queuedChangedFileMap.size).toEqual(0);
            });
        });
        it('should not queue changes when subsequent build is called after the first build', function () {
            var changedFileOne = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter.ts'
            };
            var changedFileTwo = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter2.ts'
            };
            var changedFiles = [changedFileOne, changedFileTwo];
            var context = {};
            spyOn(watch, watch.queueOrRunBuildUpdate.name).and.callThrough();
            spyOn(build, build.buildUpdate.name).and.returnValue(Promise.resolve());
            var promise = watch.queueOrRunBuildUpdate(changedFiles, context);
            return promise.then(function () {
                expect(watch.queueOrRunBuildUpdate).toHaveBeenCalledTimes(1);
                expect(build.buildUpdate).toHaveBeenCalledWith(changedFiles, context);
                expect(watch.buildUpdatePromise).toEqual(null);
                expect(watch.queuedChangedFileMap.size).toEqual(0);
                return watch.queueOrRunBuildUpdate(changedFiles, context);
            }).then(function () {
                expect(watch.queueOrRunBuildUpdate).toHaveBeenCalledTimes(2);
                expect(build.buildUpdate).toHaveBeenCalledWith(changedFiles, context);
                expect(watch.buildUpdatePromise).toEqual(null);
                expect(watch.queuedChangedFileMap.size).toEqual(0);
                return watch.queueOrRunBuildUpdate(changedFiles, context);
            }).then(function () {
                expect(watch.queueOrRunBuildUpdate).toHaveBeenCalledTimes(3);
                expect(build.buildUpdate).toHaveBeenCalledWith(changedFiles, context);
                expect(watch.buildUpdatePromise).toEqual(null);
                expect(watch.queuedChangedFileMap.size).toEqual(0);
            });
        });
        it('should queue up changes when a build is active', function () {
            var changedFileOne = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter.ts'
            };
            var changedFileTwo = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter2.ts'
            };
            var changedFileThree = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter3.ts'
            };
            var changedFileFour = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter4.ts'
            };
            var changedFileFive = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter5.ts'
            };
            var changedFileSix = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter6.ts'
            };
            var originalChangedFiles = [changedFileOne, changedFileTwo];
            var secondSetOfChangedFiles = [changedFileThree, changedFileFour];
            var ThirdSetOfChangedFiles = [changedFileTwo, changedFileFour, changedFileFive, changedFileSix];
            var context = {};
            var firstPromiseResolve = null;
            var firstPromise = new Promise(function (resolve, reject) {
                firstPromiseResolve = resolve;
            });
            spyOn(watch, watch.queueOrRunBuildUpdate.name).and.callThrough();
            var buildUpdateSpy = spyOn(build, build.buildUpdate.name).and.callFake(function (changedFiles, context) {
                if (changedFiles === originalChangedFiles) {
                    return firstPromise;
                }
                else {
                    return Promise.resolve();
                }
            });
            // call the original
            expect(watch.buildUpdatePromise).toBeFalsy();
            var promise = watch.queueOrRunBuildUpdate(originalChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(0);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            // okay, call again and it should be queued now
            watch.queueOrRunBuildUpdate(secondSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(2);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            // okay, let's queue some more
            watch.queueOrRunBuildUpdate(ThirdSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(5);
            expect(watch.queuedChangedFileMap.get(changedFileTwo.filePath)).toEqual(changedFileTwo);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(watch.queuedChangedFileMap.get(changedFileFive.filePath)).toEqual(changedFileFive);
            expect(watch.queuedChangedFileMap.get(changedFileSix.filePath)).toEqual(changedFileSix);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            firstPromiseResolve();
            return promise.then(function () {
                expect(watch.buildUpdatePromise).toBeFalsy();
                expect(watch.queuedChangedFileMap.size).toEqual(0);
                expect(build.buildUpdate).toHaveBeenCalledTimes(2);
                expect(buildUpdateSpy.calls.first().args[0]).toEqual(originalChangedFiles);
                expect(buildUpdateSpy.calls.first().args[1]).toEqual(context);
                expect(buildUpdateSpy.calls.mostRecent().args[0].length).toEqual(5);
                // make sure the array contains the elements that we expect it to
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileTwo; })[0]).toEqual(changedFileTwo);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileThree; })[0]).toEqual(changedFileThree);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFour; })[0]).toEqual(changedFileFour);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFive; })[0]).toEqual(changedFileFive);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileSix; })[0]).toEqual(changedFileSix);
                expect(buildUpdateSpy.calls.mostRecent().args[1]).toEqual(context);
            });
        });
        it('should run buildUpdate on the queued files even if the first build update fails', function () {
            var changedFileOne = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter.ts'
            };
            var changedFileTwo = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter2.ts'
            };
            var changedFileThree = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter3.ts'
            };
            var changedFileFour = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter4.ts'
            };
            var changedFileFive = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter5.ts'
            };
            var changedFileSix = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter6.ts'
            };
            var originalChangedFiles = [changedFileOne, changedFileTwo];
            var secondSetOfChangedFiles = [changedFileThree, changedFileFour];
            var ThirdSetOfChangedFiles = [changedFileTwo, changedFileFour, changedFileFive, changedFileSix];
            var context = {};
            var firstPromiseReject = null;
            var firstPromise = new Promise(function (resolve, reject) {
                firstPromiseReject = reject;
            });
            spyOn(watch, watch.queueOrRunBuildUpdate.name).and.callThrough();
            var buildUpdateSpy = spyOn(build, build.buildUpdate.name).and.callFake(function (changedFiles, context) {
                if (changedFiles === originalChangedFiles) {
                    return firstPromise;
                }
                else {
                    return Promise.resolve();
                }
            });
            // call the original
            expect(watch.buildUpdatePromise).toBeFalsy();
            var promise = watch.queueOrRunBuildUpdate(originalChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(0);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            // okay, call again and it should be queued now
            watch.queueOrRunBuildUpdate(secondSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(2);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            // okay, let's queue some more
            watch.queueOrRunBuildUpdate(ThirdSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(5);
            expect(watch.queuedChangedFileMap.get(changedFileTwo.filePath)).toEqual(changedFileTwo);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(watch.queuedChangedFileMap.get(changedFileFive.filePath)).toEqual(changedFileFive);
            expect(watch.queuedChangedFileMap.get(changedFileSix.filePath)).toEqual(changedFileSix);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            firstPromiseReject();
            return promise.then(function () {
                expect(watch.buildUpdatePromise).toBeFalsy();
                expect(watch.queuedChangedFileMap.size).toEqual(0);
                expect(build.buildUpdate).toHaveBeenCalledTimes(2);
                expect(buildUpdateSpy.calls.first().args[0]).toEqual(originalChangedFiles);
                expect(buildUpdateSpy.calls.first().args[1]).toEqual(context);
                expect(buildUpdateSpy.calls.mostRecent().args[0].length).toEqual(5);
                // make sure the array contains the elements that we expect it to
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileTwo; })[0]).toEqual(changedFileTwo);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileThree; })[0]).toEqual(changedFileThree);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFour; })[0]).toEqual(changedFileFour);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFive; })[0]).toEqual(changedFileFive);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileSix; })[0]).toEqual(changedFileSix);
                expect(buildUpdateSpy.calls.mostRecent().args[1]).toEqual(context);
            });
        });
        it('should handle multiple queueing and unqueuing events aka advanced test', function () {
            var changedFileOne = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter.ts'
            };
            var changedFileTwo = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter2.ts'
            };
            var changedFileThree = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter3.ts'
            };
            var changedFileFour = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter4.ts'
            };
            var changedFileFive = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter5.ts'
            };
            var changedFileSix = {
                event: 'change',
                ext: '.ts',
                filePath: '/some/fake/path/that/doesnt/matter6.ts'
            };
            var originalChangedFiles = [changedFileOne, changedFileTwo];
            var secondSetOfChangedFiles = [changedFileThree, changedFileFour];
            var thirdSetOfChangedFiles = [changedFileTwo, changedFileFour, changedFileFive, changedFileSix];
            var fourthSetOfChangedFiles = [changedFileOne, changedFileThree];
            var fifthSetOfChangedFiles = [changedFileFour, changedFileFive, changedFileSix];
            var context = {};
            var firstPromiseResolve = null;
            var secondPromiseResolve = null;
            var thirdPromiseResolve = null;
            var firstPromise = new Promise(function (resolve, reject) {
                firstPromiseResolve = resolve;
            });
            var secondPromise = new Promise(function (resolve, reject) {
                secondPromiseResolve = resolve;
            });
            var thirdPromise = new Promise(function (resolve, reject) {
                thirdPromiseResolve = resolve;
            });
            spyOn(watch, watch.queueOrRunBuildUpdate.name).and.callThrough();
            var buildUpdateSpy = spyOn(build, build.buildUpdate.name).and.callFake(function (changedFiles, context) {
                if (changedFiles === originalChangedFiles) {
                    return firstPromise;
                }
                else if (changedFiles.length === 5) {
                    // hardcode the length for now as it's easier to detect which array it'll be
                    return secondPromise;
                }
                else {
                    return thirdPromise;
                }
            });
            // call the original
            expect(watch.buildUpdatePromise).toBeFalsy();
            var promise = watch.queueOrRunBuildUpdate(originalChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(0);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            expect(buildUpdateSpy.calls.first().args[0]).toEqual(originalChangedFiles);
            expect(buildUpdateSpy.calls.first().args[1]).toEqual(context);
            // okay, call again and it should be queued now
            watch.queueOrRunBuildUpdate(secondSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(2);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            // okay, let's queue some more
            watch.queueOrRunBuildUpdate(thirdSetOfChangedFiles, context);
            expect(watch.buildUpdatePromise).toBeTruthy();
            expect(watch.queuedChangedFileMap.size).toEqual(5);
            expect(watch.queuedChangedFileMap.get(changedFileTwo.filePath)).toEqual(changedFileTwo);
            expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
            expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
            expect(watch.queuedChangedFileMap.get(changedFileFive.filePath)).toEqual(changedFileFive);
            expect(watch.queuedChangedFileMap.get(changedFileSix.filePath)).toEqual(changedFileSix);
            expect(build.buildUpdate).toHaveBeenCalledTimes(1);
            firstPromiseResolve();
            return firstPromise.then(function () {
                expect(build.buildUpdate).toHaveBeenCalledTimes(2);
                expect(buildUpdateSpy.calls.mostRecent().args[0].length).toEqual(5);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileTwo; })[0]).toEqual(changedFileTwo);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileThree; })[0]).toEqual(changedFileThree);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFour; })[0]).toEqual(changedFileFour);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileFive; })[0]).toEqual(changedFileFive);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileSix; })[0]).toEqual(changedFileSix);
                expect(buildUpdateSpy.calls.mostRecent().args[1]).toEqual(context);
                // okay, give it more changes so it queues that stuff up
                // also do some assertions homie
                watch.queueOrRunBuildUpdate(fourthSetOfChangedFiles, context);
                expect(watch.buildUpdatePromise).toBeTruthy();
                expect(watch.queuedChangedFileMap.size).toEqual(2);
                expect(watch.queuedChangedFileMap.get(changedFileOne.filePath)).toEqual(changedFileOne);
                expect(watch.queuedChangedFileMap.get(changedFileThree.filePath)).toEqual(changedFileThree);
                // cool beans yo, go ahead and resolve another promise
                secondPromiseResolve();
                return secondPromise;
            }).then(function () {
                expect(build.buildUpdate).toHaveBeenCalledTimes(3);
                expect(buildUpdateSpy.calls.mostRecent().args[0].length).toEqual(2);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileOne; })[0]).toEqual(changedFileOne);
                expect(buildUpdateSpy.calls.mostRecent().args[0].concat().filter(function (changedFile) { return changedFile === changedFileThree; })[0]).toEqual(changedFileThree);
                // okay, give it more changes so it queues that stuff up
                // also do some assertions homie
                watch.queueOrRunBuildUpdate(fifthSetOfChangedFiles, context);
                expect(watch.buildUpdatePromise).toBeTruthy();
                expect(watch.queuedChangedFileMap.size).toEqual(3);
                expect(watch.queuedChangedFileMap.get(changedFileFour.filePath)).toEqual(changedFileFour);
                expect(watch.queuedChangedFileMap.get(changedFileFive.filePath)).toEqual(changedFileFive);
                expect(watch.queuedChangedFileMap.get(changedFileSix.filePath)).toEqual(changedFileSix);
                // cool beans yo, go ahead and resolve another promise
                thirdPromiseResolve();
                return thirdPromise;
            }).then(function () {
                // return the original promise just to make sure everything is chained together
                return promise;
            });
        });
    });
});
