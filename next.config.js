const withTranspileModules = require('next-transpile-modules')([
    '@navikt/nav-dekoratoren-moduler',
    '@navikt/ds-react',
]);

module.exports = withTranspileModules({
    reactStrictMode: true,
    ...(process.env.APP_BASEPATH && { basePath: process.env.APP_BASEPATH }),
    env: {
        APP_ORIGIN: process.env.APP_ORIGIN,
        APP_BASEPATH: process.env.APP_BASEPATH,
    },
    i18n: {
        locales: ['se'],
        defaultLocale: 'se',
        localeDetection: false,
    },
});
