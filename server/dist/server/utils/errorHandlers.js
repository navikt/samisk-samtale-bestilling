"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandlers = void 0;
const urls_1 = require("../urls");
const createNotFoundHandler = async () => {
    // Fetch static 404-page from the nav.no frontend
    const notFoundHtml = await fetch(urls_1.Properties.URLs.navno404)
        .then((res) => {
        if (res.status === 404) {
            return res.text();
        }
        throw Error(`${res.status} ${res.statusText}`);
    })
        .catch((e) => {
        console.error(`Failed to fetch 404 html - ${e}`);
        return 'Not found';
    });
    return (req, res, _) => {
        res.status(404).send(notFoundHtml);
    };
};
const setupErrorHandlers = async (expressApp) => {
    const notFoundHandler = await createNotFoundHandler();
    const serverErrorHandler = (err, req, res, next) => {
        const { path } = req;
        const { status, stack } = err;
        const msg = stack?.split('\n')[0];
        const statusCode = status || 500;
        if (statusCode < 500) {
            console.log(`Invalid request to ${path}: ${statusCode} ${msg}`);
            return notFoundHandler(req, res, next);
        }
        console.error(`Server error on ${path}: ${statusCode} ${msg}`);
        // TODO: Html for server errors
        return res.status(statusCode).end();
    };
    expressApp.use('*', notFoundHandler);
    expressApp.use(serverErrorHandler);
};
exports.setupErrorHandlers = setupErrorHandlers;
