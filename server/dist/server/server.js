"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const setupSiteRoutes_js_1 = require("./site/setupSiteRoutes.js");
const setupApiRoutes_1 = require("./api/setupApiRoutes");
const errorHandlers_1 = require("./utils/errorHandlers");
const { APP_PORT, APP_BASEPATH, ENV, NODE_ENV } = process.env;
console.log('env:', APP_PORT, APP_BASEPATH, ENV, NODE_ENV);
const isLocal = ENV === 'localhost';
const app = (0, express_1.default)();
app.use('*', (0, compression_1.default)());
const siteRouter = express_1.default.Router();
const apiRouter = express_1.default.Router();
app.use(APP_BASEPATH, siteRouter);
siteRouter.use('/api', apiRouter);
// Redirect from root to basepath in local development environments
if (isLocal && APP_BASEPATH && APP_BASEPATH !== '/') {
    app.get('/', (req, res) => res.redirect(APP_BASEPATH));
}
(0, setupApiRoutes_1.setupApiRoutes)(apiRouter)
    .then(() => (0, setupSiteRoutes_js_1.setupSiteRoutes)(siteRouter))
    .then(() => (0, errorHandlers_1.setupErrorHandlers)(app))
    .catch((e) => {
    console.error(`Error occured while initializing server! - ${e}`);
    throw e;
})
    .then(() => {
    const server = app.listen(APP_PORT, () => {
        console.log(`Server starting on port ${APP_PORT}`);
    });
    const shutdown = () => {
        console.log('Server shutting down');
        server.close(() => {
            console.log('Shutdown complete!');
            process.exit(0);
        });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
});
