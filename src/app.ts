import { serveStatic } from '@hono/node-server/serve-static';
import { DecoratorElements } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { Handler, Hono, MiddlewareHandler } from 'hono';
import { compress } from 'hono/compress';
import { config } from './config.js';
import { CspHeaderProvider } from './csp.js';
import { Locale } from './localization/localeUtils.js';
import { NotFoundPageProvider } from './notFound.js';
import { SubmitOrder } from './submit/submitOrder.js';
import { parseFormBody, parseJsonBody, validateForm } from './submit/validate.js';
import { renderOrderPage } from './views/render.js';

export type AppDeps = {
    getDecorator: (locale: Locale) => Promise<DecoratorElements>;
    submitOrder: SubmitOrder;
    getCspHeader: CspHeaderProvider;
    getNotFoundPage: NotFoundPageProvider;
};

const localePath = (locale: Locale) => (locale === 'nb' ? `${config.appBasePath}/nb` : config.appBasePath);

export const createApp = (deps: AppDeps) => {
    // strict: false matches trailing slashes (old Express parity)
    const root = new Hono({ strict: false });

    // local dev: redirect root to basepath
    if (config.isLocal || config.isDevelopment) {
        root.get('/', (c) => c.redirect(config.appBasePath));
    }

    root.notFound(async (c) => c.html(await deps.getNotFoundPage(), 404));

    root.onError((err, c) => {
        console.error(`Server error on ${c.req.path}: ${err}`);
        return c.text('Internal Server Error', 500);
    });

    // basePath() shares route storage with root
    const app = root.basePath(config.appBasePath);

    // probe paths are referenced in .nais/config.yaml - do not change
    app.get('/api/internal/isAlive', (c) => c.text('I am alive!'));
    app.get('/api/internal/isReady', (c) => c.json({ message: 'I am ready!' }));

    app.use(compress());

    app.use(
        '/static/*',
        serveStatic({
            root: './static',
            rewriteRequestPath: (path) => path.replace(`${config.appBasePath}/static`, ''),
            onFound: (_path, c) => {
                c.header('Cache-Control', config.isDevelopment ? 'no-store' : 'public, max-age=3600, stale-while-revalidate=86400');
            },
        })
    );

    const cspMiddleware: MiddlewareHandler = async (c, next) => {
        const csp = await deps.getCspHeader();
        if (csp) {
            c.header('Content-Security-Policy', csp);
        }
        await next();
    };
    app.use(cspMiddleware);

    const pageHandler =
        (locale: Locale): Handler =>
        async (c) => {
            const decorator = await deps.getDecorator(locale);
            const state = c.req.query('sendt') === '1' ? { confirmation: true } : {};
            return c.html(renderOrderPage(locale, decorator, state));
        };

    const submitHandler =
        (locale: Locale): Handler =>
        async (c) => {
            const wantsJson = !!c.req.header('accept')?.includes('application/json');
            const body = await c.req.parseBody({ all: true });
            const values = parseFormBody(body);
            const result = validateForm(values);

            if (!result.ok) {
                if (wantsJson) {
                    return c.json({ ok: false, errors: result.errors }, 400);
                }
                const decorator = await deps.getDecorator(locale);
                return c.html(renderOrderPage(locale, decorator, { values, errors: result.errors }), 400);
            }

            const upstream = await deps.submitOrder(result.data);

            if (!upstream.ok) {
                if (wantsJson) {
                    return c.json({ ok: false }, 502);
                }
                const decorator = await deps.getDecorator(locale);
                return c.html(renderOrderPage(locale, decorator, { values, submitError: true }), 502);
            }

            if (wantsJson) {
                return c.json({ ok: true });
            }
            // PRG: refresh must not resubmit
            return c.redirect(`${localePath(locale)}?sendt=1`, 303);
        };

    app.get('/', pageHandler('se'));
    app.post('/', submitHandler('se'));
    app.get('/nb', pageHandler('nb'));
    app.post('/nb', submitHandler('nb'));

    // legacy alias for old client JS in open tabs; remove after one prod release
    app.post('/api/proxy', async (c) => {
        const body = await c.req.json().catch(() => null);
        if (!body || typeof body !== 'object') {
            return c.json({ ok: false }, 400);
        }
        const result = validateForm(parseJsonBody(body as Record<string, unknown>));
        if (!result.ok) {
            return c.json({ ok: false, errors: result.errors }, 400);
        }
        const upstream = await deps.submitOrder(result.data);
        return upstream.ok ? c.json({ ok: true }) : c.json({ ok: false }, 502);
    });

    return root;
};
