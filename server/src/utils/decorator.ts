import { injectDecoratorServerSide, DecoratorParams } from '@navikt/nav-dekoratoren-moduler/ssr';

const decoratorEnv = process.env.ENV;
const decoratorLocalPort = 8100;
const localUrl = `${process.env.DECORATOR_LOCAL_URL}`;

export const decoratorEnvProps =
    decoratorEnv === 'localhost'
        ? {
              env: decoratorEnv,
              port: decoratorLocalPort,
              localUrl,
          }
        : { env: decoratorEnv, localUrl };
const locale = 'se';
const paramsDefault: DecoratorParams = {
    context: 'privatperson',
    language: locale,
    breadcrumbs: [
        {
            url: '/',
            title: 'title',
        },
    ],
    availableLanguages: [
        { locale: 'nb', url: '/person/bestilling-av-samisk-samtale/nb' },
        { locale: 'se', url: '/person/bestilling-av-samisk-samtale' },
    ],
};

const _injectWithDecorator = (params: DecoratorParams, templatePath: string, retries = 3): Promise<string | null> =>
    injectDecoratorServerSide({
        ...params,
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

export const injectWithDecorator = async (templatePath: string, params: DecoratorParams = paramsDefault) =>
    _injectWithDecorator(params, templatePath);
