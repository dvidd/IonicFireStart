"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var helpers = require("./helpers");
var originalEnv = null;
describe('helpers', function () {
    beforeEach(function () {
        originalEnv = process.env;
        process.env = {};
    });
    afterEach(function () {
        process.env = originalEnv;
    });
    describe('getIntPropertyValue', function () {
        it('should return an int', function () {
            // arrange
            var propertyName = 'test';
            var propertyValue = '3000';
            process.env[propertyName] = propertyValue;
            // act
            var result = helpers.getIntPropertyValue(propertyName);
            // assert
            expect(result).toEqual(3000);
        });
        it('should round to an int', function () {
            // arrange
            var propertyName = 'test';
            var propertyValue = '3000.03';
            process.env[propertyName] = propertyValue;
            // act
            var result = helpers.getIntPropertyValue(propertyName);
            // assert
            expect(result).toEqual(3000);
        });
        it('should round to a NaN', function () {
            // arrange
            var propertyName = 'test';
            var propertyValue = 'tacos';
            process.env[propertyName] = propertyValue;
            // act
            var result = helpers.getIntPropertyValue(propertyName);
            // assert
            expect(result).toEqual(NaN);
        });
    });
    describe('getBooleanPropertyValue', function () {
        beforeEach(function () {
            originalEnv = process.env;
            process.env = {};
        });
        afterEach(function () {
            process.env = originalEnv;
        });
        it('should return true when value is "true"', function () {
            // arrange
            var propertyName = 'test';
            var propertyValue = 'true';
            process.env[propertyName] = propertyValue;
            // act
            var result = helpers.getBooleanPropertyValue(propertyName);
            // assert
            expect(result).toEqual(true);
        });
        it('should return false when value is undefined/null', function () {
            // arrange
            var propertyName = 'test';
            // act
            var result = helpers.getBooleanPropertyValue(propertyName);
            // assert
            expect(result).toEqual(false);
        });
        it('should return false when value is not "true"', function () {
            // arrange
            var propertyName = 'test';
            var propertyValue = 'taco';
            process.env[propertyName] = propertyValue;
            // act
            var result = helpers.getBooleanPropertyValue(propertyName);
            // assert
            expect(result).toEqual(false);
        });
    });
    describe('processStatsImpl', function () {
        it('should convert object graph to known module map', function () {
            // arrange
            var moduleOne = '/Users/noone/myModuleOne.js';
            var moduleTwo = '/Users/noone/myModuleTwo.js';
            var moduleThree = '/Users/noone/myModuleThree.js';
            var moduleFour = '/Users/noone/myModuleFour.js';
            var objectGraph = {
                modules: [
                    {
                        identifier: moduleOne,
                        reasons: [
                            {
                                moduleIdentifier: moduleTwo
                            },
                            {
                                moduleIdentifier: moduleThree
                            }
                        ]
                    },
                    {
                        identifier: moduleTwo,
                        reasons: [
                            {
                                moduleIdentifier: moduleThree
                            }
                        ]
                    },
                    {
                        identifier: moduleThree,
                        reasons: [
                            {
                                moduleIdentifier: moduleOne
                            }
                        ]
                    },
                    {
                        identifier: moduleFour,
                        reasons: []
                    }
                ]
            };
            // act
            var result = helpers.processStatsImpl(objectGraph);
            // assert
            var setOne = result.get(moduleOne);
            expect(setOne.has(moduleTwo)).toBeTruthy();
            expect(setOne.has(moduleThree)).toBeTruthy();
            var setTwo = result.get(moduleTwo);
            expect(setTwo.has(moduleThree)).toBeTruthy();
            var setThree = result.get(moduleThree);
            expect(setThree.has(moduleOne)).toBeTruthy();
            var setFour = result.get(moduleFour);
            expect(setFour.size).toEqual(0);
        });
    });
    describe('ensureSuffix', function () {
        it('should not include the suffix of a string that already has the suffix', function () {
            expect(helpers.ensureSuffix('dan dan the sunshine man', ' man')).toEqual('dan dan the sunshine man');
        });
        it('should ensure the suffix of a string without the suffix', function () {
            expect(helpers.ensureSuffix('dan dan the sunshine', ' man')).toEqual('dan dan the sunshine man');
        });
    });
    describe('removeSuffix', function () {
        it('should remove the suffix of a string that has the suffix', function () {
            expect(helpers.removeSuffix('dan dan the sunshine man', ' man')).toEqual('dan dan the sunshine');
        });
        it('should do nothing if the string does not have the suffix', function () {
            expect(helpers.removeSuffix('dan dan the sunshine man', ' woman')).toEqual('dan dan the sunshine man');
        });
    });
    describe('replaceAll', function () {
        it('should replace a variable', function () {
            expect(helpers.replaceAll('hello $VAR world', '$VAR', 'my')).toEqual('hello my world');
        });
        it('should replace a variable with newlines', function () {
            expect(helpers.replaceAll('hello\n $VARMORETEXT\n world', '$VAR', 'NO')).toEqual('hello\n NOMORETEXT\n world');
        });
        it('should replace a variable and handle undefined', function () {
            expect(helpers.replaceAll('hello $VAR world', '$VAR', undefined)).toEqual('hello  world');
        });
    });
    describe('buildErrorToJson', function () {
        it('should return a pojo', function () {
            var buildError = new errors_1.BuildError('message1');
            buildError.name = 'name1';
            buildError.stack = 'stack1';
            buildError.isFatal = true;
            buildError.hasBeenLogged = false;
            var object = helpers.buildErrorToJson(buildError);
            expect(object.message).toEqual('message1');
            expect(object.name).toEqual(buildError.name);
            expect(object.stack).toEqual(buildError.stack);
            expect(object.isFatal).toEqual(buildError.isFatal);
            expect(object.hasBeenLogged).toEqual(buildError.hasBeenLogged);
        });
    });
    describe('upperCaseFirst', function () {
        it('should capitalize a one character string', function () {
            var result = helpers.upperCaseFirst('t');
            expect(result).toEqual('T');
        });
        it('should capitalize the first character of string', function () {
            var result = helpers.upperCaseFirst('taco');
            expect(result).toEqual('Taco');
        });
    });
    describe('removeCaseFromString', function () {
        var map = new Map();
        map.set('test', 'test');
        map.set('TEST', 'test');
        map.set('testString', 'test string');
        map.set('testString123', 'test string123');
        map.set('testString_1_2_3', 'test string 1 2 3');
        map.set('x_256', 'x 256');
        map.set('anHTMLTag', 'an html tag');
        map.set('ID123String', 'id123 string');
        map.set('Id123String', 'id123 string');
        map.set('foo bar123', 'foo bar123');
        map.set('a1bStar', 'a1b star');
        map.set('CONSTANT_CASE', 'constant case');
        map.set('CONST123_FOO', 'const123 foo');
        map.set('FOO_bar', 'foo bar');
        map.set('dot.case', 'dot case');
        map.set('path/case', 'path case');
        map.set('snake_case', 'snake case');
        map.set('snake_case123', 'snake case123');
        map.set('snake_case_123', 'snake case 123');
        map.set('"quotes"', 'quotes');
        map.set('version 0.45.0', 'version 0 45 0');
        map.set('version 0..78..9', 'version 0 78 9');
        map.set('version 4_99/4', 'version 4 99 4');
        map.set('amazon s3 data', 'amazon s3 data');
        map.set('foo_13_bar', 'foo 13 bar');
        map.forEach(function (value, key) {
            var result = helpers.removeCaseFromString(key);
            expect(result).toEqual(value);
        });
    });
    describe('sentenceCase', function () {
        it('should lower case a single word', function () {
            var resultOne = helpers.sentenceCase('test');
            var resultTwo = helpers.sentenceCase('TEST');
            expect(resultOne).toEqual('Test');
            expect(resultTwo).toEqual('Test');
        });
        it('should sentence case regular sentence cased strings', function () {
            var resultOne = helpers.sentenceCase('test string');
            var resultTwo = helpers.sentenceCase('Test String');
            expect(resultOne).toEqual('Test string');
            expect(resultTwo).toEqual('Test string');
        });
        it('should sentence case non-alphanumeric separators', function () {
            var resultOne = helpers.sentenceCase('dot.case');
            var resultTwo = helpers.sentenceCase('path/case');
            expect(resultOne).toEqual('Dot case');
            expect(resultTwo).toEqual('Path case');
        });
    });
    describe('camelCase', function () {
        it('should lower case a single word', function () {
            var resultOne = helpers.camelCase('test');
            var resultTwo = helpers.camelCase('TEST');
            expect(resultOne).toEqual('test');
            expect(resultTwo).toEqual('test');
        });
        it('should camel case regular sentence cased strings', function () {
            expect(helpers.camelCase('test string')).toEqual('testString');
            expect(helpers.camelCase('Test String')).toEqual('testString');
        });
        it('should camel case non-alphanumeric separators', function () {
            expect(helpers.camelCase('dot.case')).toEqual('dotCase');
            expect(helpers.camelCase('path/case')).toEqual('pathCase');
        });
        it('should underscore periods inside numbers', function () {
            expect(helpers.camelCase('version 1.2.10')).toEqual('version_1_2_10');
            expect(helpers.camelCase('version 1.21.0')).toEqual('version_1_21_0');
        });
        it('should camel case pascal cased strings', function () {
            expect(helpers.camelCase('TestString')).toEqual('testString');
        });
        it('should camel case non-latin strings', function () {
            expect(helpers.camelCase('simple éxample')).toEqual('simpleÉxample');
        });
    });
    describe('paramCase', function () {
        it('should param case a single word', function () {
            expect(helpers.paramCase('test')).toEqual('test');
            expect(helpers.paramCase('TEST')).toEqual('test');
        });
        it('should param case regular sentence cased strings', function () {
            expect(helpers.paramCase('test string')).toEqual('test-string');
            expect(helpers.paramCase('Test String')).toEqual('test-string');
        });
        it('should param case non-alphanumeric separators', function () {
            expect(helpers.paramCase('dot.case')).toEqual('dot-case');
            expect(helpers.paramCase('path/case')).toEqual('path-case');
        });
        it('should param case param cased strings', function () {
            expect(helpers.paramCase('TestString')).toEqual('test-string');
            expect(helpers.paramCase('testString1_2_3')).toEqual('test-string1-2-3');
            expect(helpers.paramCase('testString_1_2_3')).toEqual('test-string-1-2-3');
        });
        it('should param case non-latin strings', function () {
            expect(helpers.paramCase('My Entrée')).toEqual('my-entrée');
        });
    });
    describe('pascalCase', function () {
        it('should pascal case a single word', function () {
            expect(helpers.pascalCase('test')).toEqual('Test');
            expect(helpers.pascalCase('TEST')).toEqual('Test');
        });
        it('should pascal case regular sentence cased strings', function () {
            expect(helpers.pascalCase('test string')).toEqual('TestString');
            expect(helpers.pascalCase('Test String')).toEqual('TestString');
        });
        it('should pascal case non-alphanumeric separators', function () {
            expect(helpers.pascalCase('dot.case')).toEqual('DotCase');
            expect(helpers.pascalCase('path/case')).toEqual('PathCase');
        });
        it('should pascal case pascal cased strings', function () {
            expect(helpers.pascalCase('TestString')).toEqual('TestString');
        });
    });
    describe('snakeCase', function () {
        it('should convert the phrase to use underscores', function () {
            expect(helpers.snakeCase('taco bell')).toEqual('taco_bell');
        });
    });
    describe('constantCase', function () {
        it('should capitalize and separate words by underscore', function () {
            expect(helpers.constantCase('taco bell')).toEqual('TACO_BELL');
        });
        it('should convert camel case to correct case', function () {
            expect(helpers.constantCase('TacoBell')).toEqual('TACO_BELL');
        });
    });
});
