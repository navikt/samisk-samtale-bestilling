"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApiRoutes = void 0;
const isReadyHandler_1 = require("./routes/isReady/isReadyHandler");
const isAliveHandler_1 = require("./routes/isAlive/isAliveHandler");
const setupApiRoutes = async (router) => {
    router.get('/internal/isAlive', isAliveHandler_1.isAliveHandler);
    router.get('/internal/isReady', isReadyHandler_1.isReadyHandler);
};
exports.setupApiRoutes = setupApiRoutes;
