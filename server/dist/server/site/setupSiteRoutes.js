"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSiteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
const htmlRenderer_1 = require("./ssr/htmlRenderer");
const cacheMiddleware_1 = require("../utils/cacheMiddleware");
const cspMiddleware_1 = require("../utils/cspMiddleware");
const assetsDir = path_1.default.resolve(process.cwd(), 'dist', 'client', 'assets');
const isProd = process.env.NODE_ENV !== 'development';
const setupSiteRoutes = async (router) => {
    let render;
    if (isProd) {
        console.log(`Configuring site endpoints for production mode - Using assets dir ${assetsDir}`);
        router.use('/assets', express_1.default.static(assetsDir, {
            maxAge: '1y',
            index: 'false',
        }));
        render = htmlRenderer_1.prodRender;
    }
    else {
        console.log('Configuring site endpoints for development mode');
        const vite = await (0, vite_1.createServer)({
            server: { middlewareMode: true },
            appType: 'custom',
            root: '../',
            base: process.env.APP_BASEPATH,
        });
        router.use(vite.middlewares);
        render = (0, htmlRenderer_1.devRender)(vite);
    }
    router.use('*', (0, cacheMiddleware_1.createCacheMiddleware)({ ttlSec: 600, maxSize: 100 }), await (0, cspMiddleware_1.createCspMiddleware)());
    router.get('*', async (req, res) => {
        const html = await render(req.originalUrl);
        return res.status(200).send(html);
    });
};
exports.setupSiteRoutes = setupSiteRoutes;
