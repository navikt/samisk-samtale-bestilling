import { injectDecoratorServerSide, DecoratorParams } from '@navikt/nav-dekoratoren-moduler/ssr';
import { Locale, localeString } from '../../../common/localization/localeUtils';

const decoratorEnv = process.env.ENV;
const decoratorLocalPort = 8100;
const localUrl = `${process.env.DECORATOR_LOCAL_URL}`;

export const decoratorEnvProps =
    decoratorEnv === 'localhost'
        ? {
              env: 'localhost' as const,
              localUrl: "http://localhost:8089",
              port: 8089,
              // localUrl,
          }
        : { env: decoratorEnv };
const paramsDefault: DecoratorParams = {
    context: 'privatperson',
    language: 'se',
    breadcrumbs: [
        {
            url: '/',
            title: 'Samisk samtalebestilling',
        },
    ],
    availableLanguages: [
        { locale: 'nb', url: '/person/bestilling-av-samisk-samtale/nb' },
        { locale: 'se', url: '/person/bestilling-av-samisk-samtale' },
    ],
};

const buildBreadCrumbs = (locale: Locale) => {
    return [{ url: '/', title: localeString('tittel', locale) }];
};

const _injectWithDecorator = (params: DecoratorParams, templatePath: string, retries = 3): Promise<string | null> => {
    return injectDecoratorServerSide({
        params: {
            ...paramsDefault,
            ...params,
            breadcrumbs: buildBreadCrumbs(params.language as Locale),
            logoutWarning: true,
        },
        ...decoratorEnvProps,
        filePath: templatePath,
    }).catch((e) => {
        if (retries <= 0) {
            console.error(`Failed to fetch decorator - ${e}`);
            return null;
        }

        // Use prod-decorator on localhost if the local decorator wasn't responding
        // Probably means the docker-compose network isn't running
        if (decoratorEnv === 'localhost') {
            console.log('Local decorator did not respond, using prod decorator');
            return injectDecoratorServerSide({
                ...params,
                env: 'prod',
                filePath: templatePath,
            });
        }

        return _injectWithDecorator(params, templatePath, retries - 1);
    });
};

export const injectWithDecorator = async (templatePath: string, params: DecoratorParams) => _injectWithDecorator(params, templatePath);
