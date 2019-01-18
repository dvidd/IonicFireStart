"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
const ts = require("typescript");
const dev = Math.floor(Math.random() * 10000);
class WebpackCompilerHost {
    constructor(_options, basePath, host, cacheSourceFiles) {
        this._options = _options;
        this.cacheSourceFiles = cacheSourceFiles;
        this._changedFiles = new Set();
        this._sourceFileCache = new Map();
        this._virtualFileExtensions = [
            '.js', '.js.map',
            '.ngfactory.js', '.ngfactory.js.map',
            '.ngstyle.js', '.ngstyle.js.map',
            '.ngsummary.json',
        ];
        this._syncHost = new core_1.virtualFs.SyncDelegateHost(host);
        this._memoryHost = new core_1.virtualFs.SyncDelegateHost(new core_1.virtualFs.SimpleMemoryHost());
        this._basePath = core_1.normalize(basePath);
    }
    get virtualFiles() {
        return [...this._memoryHost.delegate
                ._cache.keys()];
    }
    denormalizePath(path) {
        return core_1.getSystemPath(core_1.normalize(path));
    }
    resolve(path) {
        const p = core_1.normalize(path);
        if (core_1.isAbsolute(p)) {
            return p;
        }
        else {
            return core_1.join(this._basePath, p);
        }
    }
    resetChangedFileTracker() {
        this._changedFiles.clear();
    }
    getChangedFilePaths() {
        return [...this._changedFiles];
    }
    getNgFactoryPaths() {
        return this.virtualFiles
            .filter(fileName => fileName.endsWith('.ngfactory.js') || fileName.endsWith('.ngstyle.js'))
            // These paths are used by the virtual file system decorator so we must denormalize them.
            .map(path => this.denormalizePath(path));
    }
    invalidate(fileName) {
        const fullPath = this.resolve(fileName);
        this._sourceFileCache.delete(fullPath);
        let exists = false;
        try {
            exists = this._syncHost.isFile(fullPath);
            if (exists) {
                this._changedFiles.add(fullPath);
            }
        }
        catch (_a) { }
        // File doesn't exist anymore and is not a factory, so we should delete the related
        // virtual files.
        if (!exists && fullPath.endsWith('.ts') && !(fullPath.endsWith('.ngfactory.ts') || fullPath.endsWith('.shim.ngstyle.ts'))) {
            this._virtualFileExtensions.forEach(ext => {
                const virtualFile = (fullPath.slice(0, -3) + ext);
                if (this._memoryHost.exists(virtualFile)) {
                    this._memoryHost.delete(virtualFile);
                }
            });
        }
        // In case resolveJsonModule and allowJs we also need to remove virtual emitted files
        // both if they exists or not.
        if ((fullPath.endsWith('.js') || fullPath.endsWith('.json'))
            && !/(\.(ngfactory|ngstyle)\.js|ngsummary\.json)$/.test(fullPath)) {
            if (this._memoryHost.exists(fullPath)) {
                this._memoryHost.delete(fullPath);
            }
        }
    }
    fileExists(fileName, delegate = true) {
        const p = this.resolve(fileName);
        if (this._memoryHost.isFile(p)) {
            return true;
        }
        if (!delegate) {
            return false;
        }
        let exists = false;
        try {
            exists = this._syncHost.isFile(p);
        }
        catch (_a) { }
        return exists;
    }
    readFile(fileName) {
        const filePath = this.resolve(fileName);
        try {
            if (this._memoryHost.isFile(filePath)) {
                return core_1.virtualFs.fileBufferToString(this._memoryHost.read(filePath));
            }
            else {
                const content = this._syncHost.read(filePath);
                return core_1.virtualFs.fileBufferToString(content);
            }
        }
        catch (_a) {
            return undefined;
        }
    }
    readFileBuffer(fileName) {
        const filePath = this.resolve(fileName);
        if (this._memoryHost.isFile(filePath)) {
            return Buffer.from(this._memoryHost.read(filePath));
        }
        else {
            const content = this._syncHost.read(filePath);
            return Buffer.from(content);
        }
    }
    _makeStats(stats) {
        return {
            isFile: () => stats.isFile(),
            isDirectory: () => stats.isDirectory(),
            isBlockDevice: () => stats.isBlockDevice && stats.isBlockDevice() || false,
            isCharacterDevice: () => stats.isCharacterDevice && stats.isCharacterDevice() || false,
            isFIFO: () => stats.isFIFO && stats.isFIFO() || false,
            isSymbolicLink: () => stats.isSymbolicLink && stats.isSymbolicLink() || false,
            isSocket: () => stats.isSocket && stats.isSocket() || false,
            dev: stats.dev === undefined ? dev : stats.dev,
            ino: stats.ino === undefined ? Math.floor(Math.random() * 100000) : stats.ino,
            mode: stats.mode === undefined ? parseInt('777', 8) : stats.mode,
            nlink: stats.nlink === undefined ? 1 : stats.nlink,
            uid: stats.uid || 0,
            gid: stats.gid || 0,
            rdev: stats.rdev || 0,
            size: stats.size,
            blksize: stats.blksize === undefined ? 512 : stats.blksize,
            blocks: stats.blocks === undefined ? Math.ceil(stats.size / 512) : stats.blocks,
            atime: stats.atime,
            atimeMs: stats.atime.getTime(),
            mtime: stats.mtime,
            mtimeMs: stats.mtime.getTime(),
            ctime: stats.ctime,
            ctimeMs: stats.ctime.getTime(),
            birthtime: stats.birthtime,
            birthtimeMs: stats.birthtime.getTime(),
        };
    }
    stat(path) {
        const p = this.resolve(path);
        let stats = null;
        try {
            stats = this._memoryHost.stat(p) || this._syncHost.stat(p);
        }
        catch (_a) { }
        if (!stats) {
            return null;
        }
        if (stats instanceof fs_1.Stats) {
            return stats;
        }
        return this._makeStats(stats);
    }
    directoryExists(directoryName) {
        const p = this.resolve(directoryName);
        try {
            return this._memoryHost.isDirectory(p) || this._syncHost.isDirectory(p);
        }
        catch (_a) {
            return false;
        }
    }
    getDirectories(path) {
        const p = this.resolve(path);
        let delegated;
        try {
            delegated = this._syncHost.list(p).filter(x => {
                try {
                    return this._syncHost.isDirectory(core_1.join(p, x));
                }
                catch (_a) {
                    return false;
                }
            });
        }
        catch (_a) {
            delegated = [];
        }
        let memory;
        try {
            memory = this._memoryHost.list(p).filter(x => {
                try {
                    return this._memoryHost.isDirectory(core_1.join(p, x));
                }
                catch (_a) {
                    return false;
                }
            });
        }
        catch (_b) {
            memory = [];
        }
        return [...new Set([...delegated, ...memory])];
    }
    getSourceFile(fileName, languageVersion, onError) {
        const p = this.resolve(fileName);
        try {
            const cached = this._sourceFileCache.get(p);
            if (cached) {
                return cached;
            }
            const content = this.readFile(fileName);
            if (content !== undefined) {
                const sf = ts.createSourceFile(workaroundResolve(fileName), content, languageVersion, true);
                if (this.cacheSourceFiles) {
                    this._sourceFileCache.set(p, sf);
                }
                return sf;
            }
        }
        catch (e) {
            if (onError) {
                onError(e.message);
            }
        }
        return undefined;
    }
    getDefaultLibFileName(options) {
        return ts.createCompilerHost(options).getDefaultLibFileName(options);
    }
    // This is due to typescript CompilerHost interface being weird on writeFile. This shuts down
    // typings in WebStorm.
    get writeFile() {
        return (fileName, data, _writeByteOrderMark, onError, _sourceFiles) => {
            const p = this.resolve(fileName);
            try {
                this._memoryHost.write(p, core_1.virtualFs.stringToFileBuffer(data));
            }
            catch (e) {
                if (onError) {
                    onError(e.message);
                }
            }
        };
    }
    getCurrentDirectory() {
        return this._basePath;
    }
    getCanonicalFileName(fileName) {
        const path = this.resolve(fileName);
        return this.useCaseSensitiveFileNames ? path : path.toLowerCase();
    }
    useCaseSensitiveFileNames() {
        return !process.platform.startsWith('win32');
    }
    getNewLine() {
        return '\n';
    }
    setResourceLoader(resourceLoader) {
        this._resourceLoader = resourceLoader;
    }
    readResource(fileName) {
        if (this._resourceLoader) {
            // These paths are meant to be used by the loader so we must denormalize them.
            const denormalizedFileName = this.denormalizePath(core_1.normalize(fileName));
            return this._resourceLoader.get(denormalizedFileName);
        }
        else {
            return this.readFile(fileName);
        }
    }
    trace(message) {
        console.log(message);
    }
}
exports.WebpackCompilerHost = WebpackCompilerHost;
// `TsCompilerAotCompilerTypeCheckHostAdapter` in @angular/compiler-cli seems to resolve module
// names directly via `resolveModuleName`, which prevents full Path usage.
// To work around this we must provide the same path format as TS internally uses in
// the SourceFile paths.
function workaroundResolve(path) {
    return core_1.getSystemPath(core_1.normalize(path)).replace(/\\/g, '/');
}
exports.workaroundResolve = workaroundResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvbmd0b29scy93ZWJwYWNrL3NyYy9jb21waWxlcl9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBTzhCO0FBQzlCLDJCQUEyQjtBQUMzQixpQ0FBaUM7QUFTakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFHOUMsTUFBYSxtQkFBbUI7SUFlOUIsWUFDVSxRQUE0QixFQUNwQyxRQUFnQixFQUNoQixJQUFvQixFQUNILGdCQUF5QjtRQUhsQyxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUduQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVM7UUFoQnBDLGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUdsQyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBeUIsQ0FBQztRQUNwRCwyQkFBc0IsR0FBRztZQUMvQixLQUFLLEVBQUUsU0FBUztZQUNoQixlQUFlLEVBQUUsbUJBQW1CO1lBQ3BDLGFBQWEsRUFBRSxpQkFBaUI7WUFDaEMsaUJBQWlCO1NBQ2xCLENBQUM7UUFTQSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGdCQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBWSxZQUFZO1FBQ3RCLE9BQU8sQ0FBQyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBNEM7aUJBQ3RFLE1BQU0sQ0FBQyxJQUFJLEVB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QkFBaUIsQ0FBQyxJQUFtQjtJQUNuRCxPQUFPLG9CQUFhLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUZELDhDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgUGF0aCxcbiAgZ2V0U3lzdGVtUGF0aCxcbiAgaXNBYnNvbHV0ZSxcbiAgam9pbixcbiAgbm9ybWFsaXplLFxuICB2aXJ0dWFsRnMsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFN0YXRzIH0gZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBXZWJwYWNrUmVzb3VyY2VMb2FkZXIgfSBmcm9tICcuL3Jlc291cmNlX2xvYWRlcic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBPbkVycm9yRm4ge1xuICAobWVzc2FnZTogc3RyaW5nKTogdm9pZDtcbn1cblxuXG5jb25zdCBkZXYgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCk7XG5cblxuZXhwb3J0IGNsYXNzIFdlYnBhY2tDb21waWxlckhvc3QgaW1wbGVtZW50cyB0cy5Db21waWxlckhvc3Qge1xuICBwcml2YXRlIF9zeW5jSG9zdDogdmlydHVhbEZzLlN5bmNEZWxlZ2F0ZUhvc3Q7XG4gIHByaXZhdGUgX21lbW9yeUhvc3Q6IHZpcnR1YWxGcy5TeW5jRGVsZWdhdGVIb3N0O1xuICBwcml2YXRlIF9jaGFuZ2VkRmlsZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBfYmFzZVBhdGg6IFBhdGg7XG4gIHByaXZhdGUgX3Jlc291cmNlTG9hZGVyPzogV2VicGFja1Jlc291cmNlTG9hZGVyO1xuICBwcml2YXRlIF9zb3VyY2VGaWxlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgdHMuU291cmNlRmlsZT4oKTtcbiAgcHJpdmF0ZSBfdmlydHVhbEZpbGVFeHRlbnNpb25zID0gW1xuICAgICcuanMnLCAnLmpzLm1hcCcsXG4gICAgJy5uZ2ZhY3RvcnkuanMnLCAnLm5nZmFjdG9yeS5qcy5tYXAnLFxuICAgICcubmdzdHlsZS5qcycsICcubmdzdHlsZS5qcy5tYXAnLFxuICAgICcubmdzdW1tYXJ5Lmpzb24nLFxuICBdO1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zLFxuICAgIGJhc2VQYXRoOiBzdHJpbmcsXG4gICAgaG9zdDogdmlydHVhbEZzLkhvc3QsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYWNoZVNvdXJjZUZpbGVzOiBib29sZWFuLFxuICApIHtcbiAgICB0aGlzLl9zeW5jSG9zdCA9IG5ldyB2aXJ0dWFsRnMuU3luY0RlbGVnYXRlSG9zdChob3N0KTtcbiAgICB0aGlzLl9tZW1vcnlIb3N0ID0gbmV3IHZpcnR1YWxGcy5TeW5jRGVsZWdhdGVIb3N0KG5ldyB2aXJ0dWFsRnMuU2ltcGxlTWVtb3J5SG9zdCgpKTtcbiAgICB0aGlzLl9iYXNlUGF0aCA9IG5vcm1hbGl6ZShiYXNlUGF0aCk7XG4gIH1cblxuICBwcml2YXRlIGdldCB2aXJ0dWFsRmlsZXMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gWy4uLih0aGlzLl9tZW1vcnlIb3N0LmRlbGVnYXRlIGFzIHt9IGFzIHsgX2NhY2hlOiBNYXA8UGF0aCwge30+IH0pXG4gICAgICAuX2NhY2hlLmtleXMoKV07XG4gIH1cblxuICBkZW5vcm1hbGl6ZVBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGdldFN5c3RlbVBhdGgobm9ybWFsaXplKHBhdGgpKTtcbiAgfVxuXG4gIHJlc29sdmUocGF0aDogc3RyaW5nKTogUGF0aCB7XG4gICAgY29uc3QgcCA9IG5vcm1hbGl6ZShwYXRoKTtcbiAgICBpZiAoaXNBYnNvbHV0ZShwKSkge1xuICAgICAgcmV0dXJuIHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqb2luKHRoaXMuX2Jhc2VQYXRoLCBwKTtcbiAgICB9XG4gIH1cblxuICByZXNldENoYW5nZWRGaWxlVHJhY2tlcigpIHtcbiAgICB0aGlzLl9jaGFuZ2VkRmlsZXMuY2xlYXIoKTtcbiAgfVxuXG4gIGdldENoYW5nZWRGaWxlUGF0aHMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5fY2hhbmdlZEZpbGVzXTtcbiAgfVxuXG4gIGdldE5nRmFjdG9yeVBhdGhzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy52aXJ0dWFsRmlsZXNcbiAgICAgIC5maWx0ZXIoZmlsZU5hbWUgPT4gZmlsZU5hbWUuZW5kc1dpdGgoJy5uZ2ZhY3RvcnkuanMnKSB8fCBmaWxlTmFtZS5lbmRzV2l0aCgnLm5nc3R5bGUuanMnKSlcbiAgICAgIC8vIFRoZXNlIHBhdGhzIGFyZSB1c2VkIGJ5IHRoZSB2aXJ0dWFsIGZpbGUgc3lzdGVtIGRlY29yYXRvciBzbyB3ZSBtdXN0IGRlbm9ybWFsaXplIHRoZW0uXG4gICAgICAubWFwKHBhdGggPT4gdGhpcy5kZW5vcm1hbGl6ZVBhdGgocGF0aCkpO1xuICB9XG5cbiAgaW52YWxpZGF0ZShmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgZnVsbFBhdGggPSB0aGlzLnJlc29sdmUoZmlsZU5hbWUpO1xuICAgIHRoaXMuX3NvdXJjZUZpbGVDYWNoZS5kZWxldGUoZnVsbFBhdGgpO1xuXG4gICAgbGV0IGV4aXN0cyA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBleGlzdHMgPSB0aGlzLl9zeW5jSG9zdC5pc0ZpbGUoZnVsbFBhdGgpO1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICB0aGlzLl9jaGFuZ2VkRmlsZXMuYWRkKGZ1bGxQYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgfVxuXG4gICAgLy8gRmlsZSBkb2Vzbid0IGV4aXN0IGFueW1vcmUgYW5kIGlzIG5vdCBhIGZhY3RvcnksIHNvIHdlIHNob3VsZCBkZWxldGUgdGhlIHJlbGF0ZWRcbiAgICAvLyB2aXJ0dWFsIGZpbGVzLlxuICAgIGlmICghZXhpc3RzICYmIGZ1bGxQYXRoLmVuZHNXaXRoKCcudHMnKSAmJiAhKFxuICAgICAgZnVsbFBhdGguZW5kc1dpdGgoJy5uZ2ZhY3RvcnkudHMnKSB8fCBmdWxsUGF0aC5lbmRzV2l0aCgnLnNoaW0ubmdzdHlsZS50cycpXG4gICAgKSkge1xuICAgICAgdGhpcy5fdmlydHVhbEZpbGVFeHRlbnNpb25zLmZvckVhY2goZXh0ID0+IHtcbiAgICAgICAgY29uc3QgdmlydHVhbEZpbGUgPSAoZnVsbFBhdGguc2xpY2UoMCwgLTMpICsgZXh0KSBhcyBQYXRoO1xuICAgICAgICBpZiAodGhpcy5fbWVtb3J5SG9zdC5leGlzdHModmlydHVhbEZpbGUpKSB7XG4gICAgICAgICAgdGhpcy5fbWVtb3J5SG9zdC5kZWxldGUodmlydHVhbEZpbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJbiBjYXNlIHJlc29sdmVKc29uTW9kdWxlIGFuZCBhbGxvd0pzIHdlIGFsc28gbmVlZCB0byByZW1vdmUgdmlydHVhbCBlbWl0dGVkIGZpbGVzXG4gICAgLy8gYm90aCBpZiB0aGV5IGV4aXN0cyBvciBub3QuXG4gICAgaWYgKChmdWxsUGF0aC5lbmRzV2l0aCgnLmpzJykgfHwgZnVsbFBhdGguZW5kc1dpdGgoJy5qc29uJykpXG4gICAgICAmJiAhLyhcXC4obmdmYWN0b3J5fG5nc3R5bGUpXFwuanN8bmdzdW1tYXJ5XFwuanNvbikkLy50ZXN0KGZ1bGxQYXRoKSkge1xuICAgICAgaWYgKHRoaXMuX21lbW9yeUhvc3QuZXhpc3RzKGZ1bGxQYXRoKSkge1xuICAgICAgICB0aGlzLl9tZW1vcnlIb3N0LmRlbGV0ZShmdWxsUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyhmaWxlTmFtZTogc3RyaW5nLCBkZWxlZ2F0ZSA9IHRydWUpOiBib29sZWFuIHtcbiAgICBjb25zdCBwID0gdGhpcy5yZXNvbHZlKGZpbGVOYW1lKTtcblxuICAgIGlmICh0aGlzLl9tZW1vcnlIb3N0LmlzRmlsZShwKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBleGlzdHMgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgZXhpc3RzID0gdGhpcy5fc3luY0hvc3QuaXNGaWxlKHApO1xuICAgIH0gY2F0Y2ggeyB9XG5cbiAgICByZXR1cm4gZXhpc3RzO1xuICB9XG5cbiAgcmVhZEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLnJlc29sdmUoZmlsZU5hbWUpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLl9tZW1vcnlIb3N0LmlzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcodGhpcy5fbWVtb3J5SG9zdC5yZWFkKGZpbGVQYXRoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fc3luY0hvc3QucmVhZChmaWxlUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoY29udGVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRGaWxlQnVmZmVyKGZpbGVOYW1lOiBzdHJpbmcpOiBCdWZmZXIge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5yZXNvbHZlKGZpbGVOYW1lKTtcblxuICAgIGlmICh0aGlzLl9tZW1vcnlIb3N0LmlzRmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbSh0aGlzLl9tZW1vcnlIb3N0LnJlYWQoZmlsZVBhdGgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuX3N5bmNIb3N0LnJlYWQoZmlsZVBhdGgpO1xuXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbWFrZVN0YXRzKHN0YXRzOiB2aXJ0dWFsRnMuU3RhdHM8UGFydGlhbDxTdGF0cz4+KTogU3RhdHMge1xuICAgIHJldHVybiB7XG4gICAgICBpc0ZpbGU6ICgpID0+IHN0YXRzLmlzRmlsZSgpLFxuICAgICAgaXNEaXJlY3Rvcnk6ICgpID0+IHN0YXRzLmlzRGlyZWN0b3J5KCksXG4gICAgICBpc0Jsb2NrRGV2aWNlOiAoKSA9PiBzdGF0cy5pc0Jsb2NrRGV2aWNlICYmIHN0YXRzLmlzQmxvY2tEZXZpY2UoKSB8fCBmYWxzZSxcbiAgICAgIGlzQ2hhcmFjdGVyRGV2aWNlOiAoKSA9PiBzdGF0cy5pc0NoYXJhY3RlckRldmljZSAmJiBzdGF0cy5pc0NoYXJhY3RlckRldmljZSgpIHx8IGZhbHNlLFxuICAgICAgaXNGSUZPOiAoKSA9PiBzdGF0cy5pc0ZJRk8gJiYgc3RhdHMuaXNGSUZPKCkgfHwgZmFsc2UsXG4gICAgICBpc1N5bWJvbGljTGluazogKCkgPT4gc3RhdHMuaXNTeW1ib2xpY0xpbmsgJiYgc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSB8fCBmYWxzZSxcbiAgICAgIGlzU29ja2V0OiAoKSA9PiBzdGF0cy5pc1NvY2tldCAmJiBzdGF0cy5pc1NvY2tldCgpIHx8IGZhbHNlLFxuICAgICAgZGV2OiBzdGF0cy5kZXYgPT09IHVuZGVmaW5lZCA/IGRldiA6IHN0YXRzLmRldixcbiAgICAgIGlubzogc3RhdHMuaW5vID09PSB1bmRlZmluZWQgPyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApIDogc3RhdHMuaW5vLFxuICAgICAgbW9kZTogc3RhdHMubW9kZSA9PT0gdW5kZWZpbmVkID8gcGFyc2VJbnQoJzc3NycsIDgpIDogc3RhdHMubW9kZSxcbiAgICAgIG5saW5rOiBzdGF0cy5ubGluayA9PT0gdW5kZWZpbmVkID8gMSA6IHN0YXRzLm5saW5rLFxuICAgICAgdWlkOiBzdGF0cy51aWQgfHwgMCxcbiAgICAgIGdpZDogc3RhdHMuZ2lkIHx8IDAsXG4gICAgICByZGV2OiBzdGF0cy5yZGV2IHx8IDAsXG4gICAgICBzaXplOiBzdGF0cy5zaXplLFxuICAgICAgYmxrc2l6ZTogc3RhdHMuYmxrc2l6ZSA9PT0gdW5kZWZpbmVkID8gNTEyIDogc3RhdHMuYmxrc2l6ZSxcbiAgICAgIGJsb2Nrczogc3RhdHMuYmxvY2tzID09PSB1bmRlZmluZWQgPyBNYXRoLmNlaWwoc3RhdHMuc2l6ZSAvIDUxMikgOiBzdGF0cy5ibG9ja3MsXG4gICAgICBhdGltZTogc3RhdHMuYXRpbWUsXG4gICAgICBhdGltZU1zOiBzdGF0cy5hdGltZS5nZXRUaW1lKCksXG4gICAgICBtdGltZTogc3RhdHMubXRpbWUsXG4gICAgICBtdGltZU1zOiBzdGF0cy5tdGltZS5nZXRUaW1lKCksXG4gICAgICBjdGltZTogc3RhdHMuY3RpbWUsXG4gICAgICBjdGltZU1zOiBzdGF0cy5jdGltZS5nZXRUaW1lKCksXG4gICAgICBiaXJ0aHRpbWU6IHN0YXRzLmJpcnRodGltZSxcbiAgICAgIGJpcnRodGltZU1zOiBzdGF0cy5iaXJ0aHRpbWUuZ2V0VGltZSgpLFxuICAgIH07XG4gIH1cblxuICBzdGF0KHBhdGg6IHN0cmluZyk6IFN0YXRzIHwgbnVsbCB7XG4gICAgY29uc3QgcCA9IHRoaXMucmVzb2x2ZShwYXRoKTtcblxuICAgIGxldCBzdGF0czogdmlydHVhbEZzLlN0YXRzPFBhcnRpYWw8U3RhdHM+PiB8IFN0YXRzIHwgbnVsbCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIHN0YXRzID0gdGhpcy5fbWVtb3J5SG9zdC5zdGF0KHApIHx8IHRoaXMuX3N5bmNIb3N0LnN0YXQocCk7XG4gICAgfSBjYXRjaCB7IH1cblxuICAgIGlmICghc3RhdHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChzdGF0cyBpbnN0YW5jZW9mIFN0YXRzKSB7XG4gICAgICByZXR1cm4gc3RhdHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX21ha2VTdGF0cyhzdGF0cyk7XG4gIH1cblxuICBkaXJlY3RvcnlFeGlzdHMoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcCA9IHRoaXMucmVzb2x2ZShkaXJlY3RvcnlOYW1lKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVtb3J5SG9zdC5pc0RpcmVjdG9yeShwKSB8fCB0aGlzLl9zeW5jSG9zdC5pc0RpcmVjdG9yeShwKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXREaXJlY3RvcmllcyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcCA9IHRoaXMucmVzb2x2ZShwYXRoKTtcblxuICAgIGxldCBkZWxlZ2F0ZWQ6IHN0cmluZ1tdO1xuICAgIHRyeSB7XG4gICAgICBkZWxlZ2F0ZWQgPSB0aGlzLl9zeW5jSG9zdC5saXN0KHApLmZpbHRlcih4ID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fc3luY0hvc3QuaXNEaXJlY3Rvcnkoam9pbihwLCB4KSk7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBkZWxlZ2F0ZWQgPSBbXTtcbiAgICB9XG5cbiAgICBsZXQgbWVtb3J5OiBzdHJpbmdbXTtcbiAgICB0cnkge1xuICAgICAgbWVtb3J5ID0gdGhpcy5fbWVtb3J5SG9zdC5saXN0KHApLmZpbHRlcih4ID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbWVtb3J5SG9zdC5pc0RpcmVjdG9yeShqb2luKHAsIHgpKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIG1lbW9yeSA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBbLi4ubmV3IFNldChbLi4uZGVsZWdhdGVkLCAuLi5tZW1vcnldKV07XG4gIH1cblxuICBnZXRTb3VyY2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0LCBvbkVycm9yPzogT25FcnJvckZuKSB7XG4gICAgY29uc3QgcCA9IHRoaXMucmVzb2x2ZShmaWxlTmFtZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FjaGVkID0gdGhpcy5fc291cmNlRmlsZUNhY2hlLmdldChwKTtcbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMucmVhZEZpbGUoZmlsZU5hbWUpO1xuICAgICAgaWYgKGNvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBzZiA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUod29ya2Fyb3VuZFJlc29sdmUoZmlsZU5hbWUpLCBjb250ZW50LCBsYW5ndWFnZVZlcnNpb24sIHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlU291cmNlRmlsZXMpIHtcbiAgICAgICAgICB0aGlzLl9zb3VyY2VGaWxlQ2FjaGUuc2V0KHAsIHNmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZjtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKGUubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldERlZmF1bHRMaWJGaWxlTmFtZShvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMpIHtcbiAgICByZXR1cm4gdHMuY3JlYXRlQ29tcGlsZXJIb3N0KG9wdGlvbnMpLmdldERlZmF1bHRMaWJGaWxlTmFtZShvcHRpb25zKTtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgZHVlIHRvIHR5cGVzY3JpcHQgQ29tcGlsZXJIb3N0IGludGVyZmFjZSBiZWluZyB3ZWlyZCBvbiB3cml0ZUZpbGUuIFRoaXMgc2h1dHMgZG93blxuICAvLyB0eXBpbmdzIGluIFdlYlN0b3JtLlxuICBnZXQgd3JpdGVGaWxlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBmaWxlTmFtZTogc3RyaW5nLFxuICAgICAgZGF0YTogc3RyaW5nLFxuICAgICAgX3dyaXRlQnl0ZU9yZGVyTWFyazogYm9vbGVhbixcbiAgICAgIG9uRXJyb3I/OiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuICAgICAgX3NvdXJjZUZpbGVzPzogUmVhZG9ubHlBcnJheTx0cy5Tb3VyY2VGaWxlPixcbiAgICApOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHAgPSB0aGlzLnJlc29sdmUoZmlsZU5hbWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9tZW1vcnlIb3N0LndyaXRlKHAsIHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoZGF0YSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAob25FcnJvcikge1xuICAgICAgICAgIG9uRXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRDdXJyZW50RGlyZWN0b3J5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Jhc2VQYXRoO1xuICB9XG5cbiAgZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMucmVzb2x2ZShmaWxlTmFtZSk7XG5cbiAgICByZXR1cm4gdGhpcy51c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzID8gcGF0aCA6IHBhdGgudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFwcm9jZXNzLnBsYXRmb3JtLnN0YXJ0c1dpdGgoJ3dpbjMyJyk7XG4gIH1cblxuICBnZXROZXdMaW5lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdcXG4nO1xuICB9XG5cbiAgc2V0UmVzb3VyY2VMb2FkZXIocmVzb3VyY2VMb2FkZXI6IFdlYnBhY2tSZXNvdXJjZUxvYWRlcikge1xuICAgIHRoaXMuX3Jlc291cmNlTG9hZGVyID0gcmVzb3VyY2VMb2FkZXI7XG4gIH1cblxuICByZWFkUmVzb3VyY2UoZmlsZU5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9yZXNvdXJjZUxvYWRlcikge1xuICAgICAgLy8gVGhlc2UgcGF0aHMgYXJlIG1lYW50IHRvIGJlIHVzZWQgYnkgdGhlIGxvYWRlciBzbyB3ZSBtdXN0IGRlbm9ybWFsaXplIHRoZW0uXG4gICAgICBjb25zdCBkZW5vcm1hbGl6ZWRGaWxlTmFtZSA9IHRoaXMuZGVub3JtYWxpemVQYXRoKG5vcm1hbGl6ZShmaWxlTmFtZSkpO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VMb2FkZXIuZ2V0KGRlbm9ybWFsaXplZEZpbGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZEZpbGUoZmlsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHRyYWNlKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICB9XG59XG5cblxuLy8gYFRzQ29tcGlsZXJBb3RDb21waWxlclR5cGVDaGVja0hvc3RBZGFwdGVyYCBpbiBAYW5ndWxhci9jb21waWxlci1jbGkgc2VlbXMgdG8gcmVzb2x2ZSBtb2R1bGVcbi8vIG5hbWVzIGRpcmVjdGx5IHZpYSBgcmVzb2x2ZU1vZHVsZU5hbWVgLCB3aGljaCBwcmV2ZW50cyBmdWxsIFBhdGggdXNhZ2UuXG4vLyBUbyB3b3JrIGFyb3VuZCB0aGlzIHdlIG11c3QgcHJvdmlkZSB0aGUgc2FtZSBwYXRoIGZvcm1hdCBhcyBUUyBpbnRlcm5hbGx5IHVzZXMgaW5cbi8vIHRoZSBTb3VyY2VGaWxlIHBhdGhzLlxuZXhwb3J0IGZ1bmN0aW9uIHdvcmthcm91bmRSZXNvbHZlKHBhdGg6IFBhdGggfCBzdHJpbmcpIHtcbiAgcmV0dXJuIGdldFN5c3RlbVBhdGgobm9ybWFsaXplKHBhdGgpKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG59XG4iXX0=