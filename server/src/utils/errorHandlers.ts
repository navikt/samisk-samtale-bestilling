import { ErrorRequestHandler, Express, RequestHandler } from 'express';
import { Properties } from '../urls';

const createNotFoundHandler = async (): Promise<RequestHandler> => {
    // Fetch static 404-page from the nav.no frontend
    const notFoundHtml = await fetch(Properties.URLs.navno404)
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

export const setupErrorHandlers = async (expressApp: Express) => {
    const notFoundHandler = await createNotFoundHandler();

    const serverErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
