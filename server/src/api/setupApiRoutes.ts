import { Router } from 'express';
import { isReadyHandler } from './routes/isReady/isReadyHandler';
import { isAliveHandler } from './routes/isAlive/isAliveHandler';
import { proxyHandler } from './routes/submitProxy/submitProxyHandler';

export const setupApiRoutes = async (router: Router) => {
    router.get('/internal/isAlive', isAliveHandler);
    router.get('/internal/isReady', isReadyHandler);
    router.get('/foo', (req, res) => res.status(200).send('Foo route'));
    router.post('/proxy', proxyHandler);
};
