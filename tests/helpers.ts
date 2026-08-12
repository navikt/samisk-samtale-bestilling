import { DecoratorElements } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { vi } from 'vitest';
import { AppDeps } from '../src/app.js';

export const BASE_PATH = '/person/bestilling-av-samisk-samtale';

// Minimal valid markup per slot to prove Layout's interpolation points;
// the decorator's own markup is not ours to validate.
export const stubDecorator: DecoratorElements = {
    DECORATOR_HEAD_ASSETS: '<meta name="stub-decorator" content="head-assets">',
    DECORATOR_HEADER: '<header id="stub-decorator-header"></header>',
    DECORATOR_FOOTER: '<footer id="stub-decorator-footer"></footer>',
    DECORATOR_SCRIPTS: '<script src="/stub-decorator.js" defer=""></script>',
};

export const createStubDeps = (overrides: Partial<AppDeps> = {}): AppDeps => ({
    getDecorator: vi.fn(async () => stubDecorator),
    submitOrder: vi.fn(async () => ({ ok: true, status: 200 })),
    getCspHeader: vi.fn(async () => "default-src 'self'"),
    getNotFoundPage: vi.fn(async () => '<h1>Fant ikke siden</h1>'),
    ...overrides,
});
