"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = require("./util/constants");
var util_1 = require("./generators/util");
exports.getNgModules = util_1.getNgModules;
function processPageRequest(context, name, commandOptions) {
    if (commandOptions) {
        var hydratedRequest = util_1.hydrateRequest(context, { type: 'page', name: name, includeNgModule: commandOptions.module });
        return util_1.generateTemplates(context, hydratedRequest, commandOptions.constants);
    }
    else {
        var hydratedRequest = util_1.hydrateRequest(context, { type: 'page', name: name, includeNgModule: false });
        return util_1.generateTemplates(context, hydratedRequest);
    }
}
exports.processPageRequest = processPageRequest;
function processPipeRequest(context, name, ngModulePath) {
    return util_1.nonPageFileManipulation(context, name, ngModulePath, 'pipe');
}
exports.processPipeRequest = processPipeRequest;
function processDirectiveRequest(context, name, ngModulePath) {
    return util_1.nonPageFileManipulation(context, name, ngModulePath, 'directive');
}
exports.processDirectiveRequest = processDirectiveRequest;
function processComponentRequest(context, name, ngModulePath) {
    return util_1.nonPageFileManipulation(context, name, ngModulePath, 'component');
}
exports.processComponentRequest = processComponentRequest;
function processProviderRequest(context, name, ngModulePath) {
    return util_1.nonPageFileManipulation(context, name, ngModulePath, 'provider');
}
exports.processProviderRequest = processProviderRequest;
function processTabsRequest(context, name, tabs, commandOptions) {
    var includePageConstants = commandOptions ? commandOptions.constants : false;
    var includeNgModule = commandOptions ? commandOptions.module : false;
    var tabHydratedRequests = tabs.map(function (tab) { return util_1.hydrateRequest(context, { type: 'page', name: tab, includeNgModule: includeNgModule }); });
    var hydratedRequest = util_1.hydrateTabRequest(context, { type: 'tabs', name: name, includeNgModule: includeNgModule, tabs: tabHydratedRequests });
    return util_1.generateTemplates(context, hydratedRequest, includePageConstants).then(function () {
        var promises = tabHydratedRequests.map(function (hydratedRequest) {
            return util_1.generateTemplates(context, hydratedRequest, includePageConstants);
        });
        return Promise.all(promises);
    }).then(function (tabs) {
        util_1.tabsModuleManipulation(tabs, hydratedRequest, tabHydratedRequests);
    });
}
exports.processTabsRequest = processTabsRequest;
function listOptions() {
    var list = [];
    list.push({ type: Constants.COMPONENT, multiple: false });
    list.push({ type: Constants.DIRECTIVE, multiple: false });
    list.push({ type: Constants.PAGE, multiple: false });
    list.push({ type: Constants.PIPE, multiple: false });
    list.push({ type: Constants.PROVIDER, multiple: false });
    list.push({ type: Constants.TABS, multiple: true });
    return list;
}
exports.listOptions = listOptions;
