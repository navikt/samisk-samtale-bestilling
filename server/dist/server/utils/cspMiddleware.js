"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCspMiddleware = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const ssr_1 = require("@navikt/nav-dekoratoren-moduler/ssr");
const decorator_1 = require("./decorator");
const csp_header_1 = require("csp-header");
/*
 * This middleware sets a CSP-header compatible with nav-dekoratoren
 * Refresh every 10 minutes to ensure we stay in sync with nav-dekoratoren
 * */
const HMR_SERVER = 'ws://localhost:24678';
const myDirectives = {
    'script-src': [csp_header_1.SELF],
    'script-src-elem': [csp_header_1.SELF],
    'style-src': [csp_header_1.SELF],
    'style-src-elem': [csp_header_1.SELF],
    ...(process.env.NODE_ENV === 'development' && {
        'connect-src': [HMR_SERVER],
    }),
};
const cache = new node_cache_1.default({ deleteOnExpire: false, stdTTL: 600 });
const cacheKey = 'csp';
const buildAndCache = async () => {
    const csp = await (0, ssr_1.buildCspHeader)(myDirectives, decorator_1.decoratorEnvProps);
    cache.set(cacheKey, csp);
};
cache.on('expired', buildAndCache);
const createCspMiddleware = async () => {
    await buildAndCache();
    return (req, res, next) => {
        const csp = cache.get(cacheKey);
        if (!csp) {
            console.error('CSP header value not available!');
            return next();
        }
        res.setHeader('Content-Security-Policy', csp);
        next();
    };
};
exports.createCspMiddleware = createCspMiddleware;
