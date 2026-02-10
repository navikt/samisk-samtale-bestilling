import express, { Router } from 'express';
import path from 'path';
import { createServer } from 'vite';
import { HtmlRenderer, devRender, prodRender } from './ssr/htmlRenderer';
import { createCspMiddleware } from '../utils/cspMiddleware';

const assetsDir = path.resolve(process.cwd(), 'server', 'dist', 'client', 'assets');
const isProd = process.env.NODE_ENV !== 'development';

export const setupSiteRoutes = async (router: Router) => {
    let render: HtmlRenderer;

    if (isProd) {
        console.log(`Configuring site endpoints for production mode - Using assets dir ${assetsDir}`);

        router.use(
            '/assets',
            express.static(assetsDir, {
                maxAge: '1y',
                index: 'false',
            })
        );
        render = prodRender;
    } else {
        console.log('Configuring site endpoints for development mode');

        const vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
            root: '../',
            base: process.env.VITE_APP_BASEPATH,
        });
        router.use(vite.middlewares);
        render = devRender(vite);
    }

    router.use(await createCspMiddleware());
    router.get('/', (req, res, next) => {
        render('se', req.originalUrl)
            .then((html) => res.status(200).send(html))
            .catch(next);
    });
    router.get('/nb', (req, res, next) => {
        render('nb', req.originalUrl)
            .then((html) => res.status(200).send(html))
            .catch(next);
    });
};
