"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectWithDecorator = exports.decoratorEnvProps = void 0;
const ssr_1 = require("@navikt/nav-dekoratoren-moduler/ssr");
const decoratorEnv = process.env.ENV;
const decoratorLocalPort = 8100;
exports.decoratorEnvProps = decoratorEnv === 'localhost'
    ? {
        env: decoratorEnv,
        port: decoratorLocalPort,
    }
    : { env: decoratorEnv };
const paramsDefault = {
    breadcrumbs: [
        {
            url: '/',
            title: 'Min app',
        },
    ],
};
const _injectWithDecorator = (params, templatePath, retries = 3) => (0, ssr_1.injectDecoratorServerSide)({
    ...params,
    ...exports.decoratorEnvProps,
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
        return (0, ssr_1.injectDecoratorServerSide)({
            ...params,
            env: 'prod',
            filePath: templatePath,
        });
    }
    return _injectWithDecorator(params, templatePath, retries - 1);
});
const injectWithDecorator = async (templatePath, params = paramsDefault) => _injectWithDecorator(params, templatePath);
exports.injectWithDecorator = injectWithDecorator;
