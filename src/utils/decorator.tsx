import React from 'react';
import {
    Components,
    Props,
    fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import { objectToQueryString } from './fetch';
import { Params } from '@navikt/nav-dekoratoren-moduler';
import { Locale, localeString } from '../localization/LocaleString';

const decoratorUrl = process.env.DECORATOR_FALLBACK_URL;
const decoratorEnv = process.env.ENV as Props['env'];
const decoratorLocalPort = process.env.DECORATOR_LOCAL_PORT || 8100;
const fetchTimeoutMs = 15000;

export const getDecoratorParams = (locale: Locale): Params => ({
    context: 'privatperson',
    language: locale,
    breadcrumbs: [
        {
            url: `/`,
            title: localeString('tittel', locale),
        },
    ],
    availableLanguages: [
        { locale: 'nb', url: '/person/bestilling-av-samisk-samtale/nb' },
        { locale: 'se', url: '/person/bestilling-av-samisk-samtale' },
    ],
});

const decoratorComponentsCSR = (locale: Locale): Components => {
    const query = objectToQueryString(getDecoratorParams(locale));

    return {
        Header: () => <div id="decorator-header" />,
        Styles: () => (
            <link href={`${decoratorUrl}/css/client.css`} rel="stylesheet" />
        ),
        Footer: () => <div id="decorator-footer" />,
        Scripts: () => (
            <>
                <div
                    id="decorator-env"
                    data-src={`${decoratorUrl}/env${query || ''}`}
                />
                <script async={true} src={`${decoratorUrl}/client.js`} />
            </>
        ),
    };
};

export const getDecoratorComponents = async (
    locale: Locale
): Promise<Components> => {
    try {
        const props =
            decoratorEnv === 'localhost'
                ? {
                      env: decoratorEnv,
                      port: decoratorLocalPort,
                  }
                : {
                      env: decoratorEnv,
                  };
        const decoratorComponents = await Promise.race([
            fetchDecoratorReact({
                ...getDecoratorParams(locale),
                ...props,
            }),
            new Promise((res, rej) =>
                setTimeout(() => rej('Fetch timeout'), fetchTimeoutMs)
            ),
        ]);

        return decoratorComponents as Components;
    } catch (e) {
        console.error(`Failed to fetch decorator - ${e}`);
        return decoratorComponentsCSR(locale);
    }
};
