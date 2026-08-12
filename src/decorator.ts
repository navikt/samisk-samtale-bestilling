import { DecoratorElements, DecoratorEnvProps, DecoratorParams, fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import { config } from './config.js';
import { Locale, localeString } from './localization/localeUtils.js';

export const decoratorEnvProps: DecoratorEnvProps =
    config.env === 'localhost' ? { env: 'localhost', localUrl: config.decoratorLocalUrl || '' } : { env: config.env };

const buildParams = (locale: Locale): DecoratorParams => ({
    context: 'privatperson',
    language: locale,
    logoutWarning: true,
    breadcrumbs: [{ url: '/', title: localeString('tittel', locale) }],
    availableLanguages: [
        { locale: 'nb', url: `${config.appBasePath}/nb` },
        { locale: 'se', url: config.appBasePath },
    ],
});

const emptyDecorator: DecoratorElements = {
    DECORATOR_HEAD_ASSETS: '',
    DECORATOR_HEADER: '',
    DECORATOR_FOOTER: '',
    DECORATOR_SCRIPTS: '',
};

// fetchDecoratorHtml caches internally (1h TTL + version watcher);
// on total failure the page renders undecorated.
export const getDecorator = (locale: Locale): Promise<DecoratorElements> =>
    fetchDecoratorHtml({ ...decoratorEnvProps, params: buildParams(locale) }).catch((e) => {
        console.error(`Failed to fetch decorator - ${e}`);
        return emptyDecorator;
    });
