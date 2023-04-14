import React from 'react';
import {
    DecoratorEnvProps,
    DecoratorParams,
    fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import { Locale, localeString } from '../localization/LocaleString';

const { DECORATOR_LOCAL_URL, ENV } = process.env;
const decoratorEnv = ENV as DecoratorEnvProps['env'] || 'prod';

export const getDecoratorParams = (locale: Locale):DecoratorParams => ({
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

export const getDecorator = async (locale: Locale) => {
    const envProps =
        decoratorEnv === 'localhost'
            ? {
                env: decoratorEnv,
                localUrl: DECORATOR_LOCAL_URL,
            }
            : {
                env: decoratorEnv,
            };
    const decoratorProps = { ...envProps, params: getDecoratorParams(locale) };

    return fetchDecoratorReact(decoratorProps);
};
