import { injectDecoratorServerSide, Params } from '@navikt/nav-dekoratoren-moduler/ssr';

const decoratorEnv = process.env.ENV;
const decoratorLocalPort = 8100;

export const decoratorEnvProps =
    decoratorEnv === 'localhost'
        ? {
              env: decoratorEnv,
              port: decoratorLocalPort,
          }
        : { env: decoratorEnv };

const paramsDefault: Params = {
    breadcrumbs: [
        {
            url: '/',
            title: 'Min app',
        },
    ],
};

const _injectWithDecorator = (params: Params, templatePath: string, retries = 3): Promise<string | null> =>
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

export const injectWithDecorator = async (templatePath: string, params: Params = paramsDefault) => _injectWithDecorator(params, templatePath);
