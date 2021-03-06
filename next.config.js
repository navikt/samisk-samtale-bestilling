const withTranspileModules = require('next-transpile-modules')([
    '@navikt/nav-dekoratoren-moduler',
    '@navikt/ds-react',
]);

module.exports = withTranspileModules({
    reactStrictMode: true,
    basePath: process.env.APP_BASEPATH,
    env: {
        APP_ORIGIN: process.env.APP_ORIGIN,
        APP_BASEPATH: process.env.APP_BASEPATH,
        API_URL: process.env.API_URL,
        KONTAKTINFO_API_URL: process.env.KONTAKTINFO_API_URL,
    },
    i18n: {
        locales: ['se'],
        defaultLocale: 'se',
        localeDetection: false,
    },
});
