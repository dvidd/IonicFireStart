"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var globFunction = require("glob");
var helpers_1 = require("./helpers");
function isNegative(pattern) {
    return pattern[0] === '!';
}
function isString(pattern) {
    return typeof pattern === 'string';
}
function assertPatternsInput(patterns) {
    if (!patterns.every(isString)) {
        throw new Error('Each glob entry must be a string');
    }
}
function generateGlobTasks(patterns, opts) {
    patterns = [].concat(patterns);
    assertPatternsInput(patterns);
    var globTasks = [];
    opts = Object.assign({
        cache: Object.create(null),
        statCache: Object.create(null),
        realpathCache: Object.create(null),
        symlinks: Object.create(null),
        ignore: []
    }, opts);
    patterns.forEach(function (pattern, i) {
        if (isNegative(pattern)) {
            return;
        }
        var ignore = patterns.slice(i).filter(isNegative).map(function (pattern) {
            return pattern.slice(1);
        });
        var task = {
            pattern: pattern,
            opts: Object.assign({}, opts, {
                ignore: opts.ignore.concat(ignore).concat(exports.DEFAULT_IGNORE_ARRAY),
                nodir: true
            }),
            base: getBasePath(pattern)
        };
        globTasks.push(task);
    });
    return globTasks;
}
exports.generateGlobTasks = generateGlobTasks;
function globWrapper(task) {
    return new Promise(function (resolve, reject) {
        globFunction(task.pattern, task.opts, function (err, files) {
            if (err) {
                return reject(err);
            }
            var globResults = files.map(function (file) {
                return {
                    absolutePath: path_1.normalize(path_1.resolve(file)),
                    base: path_1.normalize(path_1.resolve(getBasePath(task.pattern)))
                };
            });
            return resolve(globResults);
        });
    });
}
function globAll(globs) {
    return Promise.resolve().then(function () {
        var globTasks = generateGlobTasks(globs, {});
        var resultSet = [];
        var promises = [];
        for (var _i = 0, globTasks_1 = globTasks; _i < globTasks_1.length; _i++) {
            var globTask = globTasks_1[_i];
            var promise = globWrapper(globTask);
            promises.push(promise);
            promise.then(function (globResult) {
                resultSet = resultSet.concat(globResult);
            });
        }
        return Promise.all(promises).then(function () {
            return resultSet;
        });
    });
}
exports.globAll = globAll;
function getBasePath(pattern) {
    var basePath;
    var sepRe = (process.platform === 'win32' ? /[\/\\]/ : /\/+/);
    var parent = globParent(pattern);
    basePath = toAbsoluteGlob(parent);
    if (!sepRe.test(basePath.charAt(basePath.length - 1))) {
        basePath += path_1.sep;
    }
    return basePath;
}
exports.getBasePath = getBasePath;
function isNegatedGlob(pattern) {
    var glob = { negated: false, pattern: pattern, original: pattern };
    if (pattern.charAt(0) === '!' && pattern.charAt(1) !== '(') {
        glob.negated = true;
        glob.pattern = pattern.slice(1);
    }
    return glob;
}
// https://github.com/jonschlinkert/to-absolute-glob/blob/master/index.js
function toAbsoluteGlob(pattern) {
    var cwd = helpers_1.toUnixPath(process.cwd());
    // trim starting ./ from glob patterns
    if (pattern.slice(0, 2) === './') {
        pattern = pattern.slice(2);
    }
    // when the glob pattern is only a . use an empty string
    if (pattern.length === 1 && pattern === '.') {
        pattern = '';
    }
    // store last character before glob is modified
    var suffix = pattern.slice(-1);
    // check to see if glob is negated (and not a leading negated-extglob)
    var ing = isNegatedGlob(pattern);
    pattern = ing.pattern;
    if (!path_1.isAbsolute(pattern) || pattern.slice(0, 1) === '\\') {
        pattern = path_1.join(cwd, pattern);
    }
    // if glob had a trailing `/`, re-add it now in case it was removed
    if (suffix === '/' && pattern.slice(-1) !== '/') {
        pattern += '/';
    }
    // re-add leading `!` if it was removed
    return ing.negated ? '!' + pattern : pattern;
}
// https://github.com/es128/glob-parent/blob/master/index.js
function globParent(pattern) {
    // special case for strings ending in enclosure containing path separator
    if (/[\{\[].*[\/]*.*[\}\]]$/.test(pattern))
        pattern += '/';
    // preserves full path in case of trailing path separator
    pattern += 'a';
    // remove path parts that are globby
    do {
        pattern = helpers_1.toUnixPath(path_1.dirname(pattern));
    } while (isGlob(pattern) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(pattern));
    // remove escape chars and return result
    return pattern.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, '$1');
}
// https://github.com/jonschlinkert/is-glob/blob/master/index.js
function isGlob(pattern) {
    if (pattern === '') {
        return false;
    }
    if (isExtglob(pattern))
        return true;
    var regex = /(\\).|([*?]|\[.*\]|\{.*\}|\(.*\|.*\)|^!)/;
    var match;
    while ((match = regex.exec(pattern))) {
        if (match[2])
            return true;
        pattern = pattern.slice(match.index + match[0].length);
    }
    return false;
}
// https://github.com/jonschlinkert/is-extglob/blob/master/index.js
function isExtglob(pattern) {
    if (pattern === '') {
        return false;
    }
    var match;
    while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(pattern))) {
        if (match[2])
            return true;
        pattern = pattern.slice(match.index + match[0].length);
    }
    return false;
}
exports.DEFAULT_IGNORE_ARRAY = ['**/*.DS_Store'];
