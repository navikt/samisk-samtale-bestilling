import dotenv from 'dotenv';

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { setupSiteRoutes } from './site/setupSiteRoutes.js';
import { setupApiRoutes } from './api/setupApiRoutes';
import { setupErrorHandlers } from './utils/errorHandlers';
import path from 'path';

console.log('Starting server...');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { APP_PORT, VITE_APP_BASEPATH, ENV } = process.env;
console.log(`environment: APP_PORT: ${APP_PORT}, VITE_APP_BASEPATH: ${VITE_APP_BASEPATH}, ENV: ${ENV}`);

const isLocal = ENV === 'localhost';

const app = express();
app.use('*', compression());
app.use(bodyParser.json());

const siteRouter = express.Router();
const apiRouter = express.Router();

app.use(VITE_APP_BASEPATH, siteRouter);
siteRouter.use('/api', apiRouter);

// Redirect from root to basepath in local development environments
if (isLocal && VITE_APP_BASEPATH && VITE_APP_BASEPATH !== '/') {
    app.get('/', (req, res) => res.redirect(VITE_APP_BASEPATH));
}

console.log('Setting up routes...');
setupApiRoutes(apiRouter)
    .then(() => setupSiteRoutes(siteRouter))
    .then(() => setupErrorHandlers(app))
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

            // Set a timeout to force close the server after 2 seconds
            setTimeout(() => {
                console.log('Force closing server after timeout');
                process.exit(0);
            }, 2000);

            server.close(() => {
                console.log('Shutdown complete!');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    });
