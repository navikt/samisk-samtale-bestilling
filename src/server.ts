import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { config } from './config.js';
import { createCspHeaderProvider } from './csp.js';
import { getDecorator } from './decorator.js';
import { createNotFoundPageProvider } from './notFound.js';
import { submitOrder } from './submit/submitOrder.js';

console.log(`Starting server - env: ${config.env}, port: ${config.appPort}, basePath: ${config.appBasePath}`);

const app = createApp({
    getDecorator,
    submitOrder,
    getCspHeader: createCspHeaderProvider(),
    getNotFoundPage: createNotFoundPageProvider(),
});

const server = serve({ fetch: app.fetch, port: config.appPort }, (info) => {
    console.log(`Server starting on port ${info.port}`);
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
