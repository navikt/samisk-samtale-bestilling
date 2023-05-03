module.exports = {
    reactStrictMode: true,
    basePath: process.env.APP_BASEPATH,
    env: {
        APP_ORIGIN: process.env.APP_ORIGIN,
        APP_BASEPATH: process.env.APP_BASEPATH,
        API_URL: process.env.API_URL,
        KONTAKTINFO_API_URL: process.env.KONTAKTINFO_API_URL,
    },
    i18n: {
        locales: ['se', 'nb'],
        defaultLocale: 'se',
        localeDetection: false,
    },
    transpilePackages: [
        '@navikt/nav-dekoratoren-moduler',
        '@navikt/ds-react',
    ],
    webpack: (config) => {
        config.resolve.fallback = {
            canvas: false,
        };
        return config;
    },
};
