import { buildCspHeader } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { SELF } from 'csp-header';
import { config } from './config.js';
import { decoratorEnvProps } from './decorator.js';

// CSP header compatible with nav-dekoratoren. Rebuilt lazily every 10 minutes;
// on failure the previous value is kept.

const TEN_MINUTES_MS = 10 * 60 * 1000;

const myDirectives = {
    'script-src': [SELF],
    'script-src-elem': [SELF],
    'style-src': [SELF],
    'style-src-elem': [SELF],
    'img-src': ["'self' data:"],
    // kontaktinfo origin: mock upstream locally, nav.no in prod
    'connect-src': [SELF, new URL(config.kontaktinfoApiUrl).origin],
};

export type CspHeaderProvider = () => Promise<string | null>;

export const createCspHeaderProvider = (): CspHeaderProvider => {
    let csp: string | null = null;
    let fetchedAt = 0;

    return async () => {
        if (Date.now() - fetchedAt > TEN_MINUTES_MS) {
            fetchedAt = Date.now();
            try {
                csp = await buildCspHeader(myDirectives, decoratorEnvProps);
            } catch (e) {
                console.error(`Failed to build CSP header - ${e}`);
            }
        }
        return csp;
    };
};
