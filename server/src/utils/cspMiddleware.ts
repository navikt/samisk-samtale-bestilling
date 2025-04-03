import { RequestHandler } from 'express';
import Cache from 'node-cache';
import { buildCspHeader } from '@navikt/nav-dekoratoren-moduler/ssr';
import { decoratorEnvProps } from './decorator';
import { SELF } from 'csp-header';

/*
 * This middleware sets a CSP-header compatible with nav-dekoratoren
 * Refresh every 10 minutes to ensure we stay in sync with nav-dekoratoren
 * */

const HMR_SERVERS = ['ws://localhost:24678', 'http://localhost:24678'];

const myDirectives = {
    'script-src': [SELF],
    'script-src-elem': [SELF],
    'style-src': [SELF],
    'style-src-elem': [SELF],
    'img-src': ["'self' data:"],
    ...(process.env.NODE_ENV === 'development' && {
        'connect-src': HMR_SERVERS,
    }),
};

const cache = new Cache({ deleteOnExpire: false, stdTTL: 600 });
const cacheKey = 'csp';

const buildAndCache = async () => {
    try {
        const csp = await buildCspHeader(myDirectives, decoratorEnvProps);
        cache.set(cacheKey, csp);
    } catch (e) {
        console.error('Failed to build CSP header', e);
    }
};

cache.on('expired', buildAndCache);

export const createCspMiddleware = async (): Promise<RequestHandler> => {
    // await buildAndCache();

    return (req, res, next) => {
        const csp = cache.get<string>(cacheKey);
        if (!csp) {
            console.error('CSP header value not available!');
            res.setHeader('Content-Security-Policy', '');
            return next();
        }

        res.setHeader('Content-Security-Policy', csp);
        next();
    };
};
