"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_loader_impl_1 = require("./cache-loader-impl");
module.exports = function loader(source, map) {
    cache_loader_impl_1.cacheLoader(source, map, this);
};
