const required = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const env = process.env.ENV;
if (env !== 'prod' && env !== 'dev' && env !== 'localhost') {
    throw new Error(`Invalid ENV: ${env} (expected 'prod', 'dev' or 'localhost')`);
}

export const config = {
    env,
    isDevelopment: process.env.NODE_ENV === 'development',
    isLocal: env === 'localhost',
    appPort: Number(required('APP_PORT')),
    appBasePath: required('APP_BASEPATH'),
    apiUrl: required('API_URL'),
    kontaktinfoApiUrl: required('KONTAKTINFO_API_URL'),
    decoratorLocalUrl: process.env.DECORATOR_LOCAL_URL,
} as const;

export type Config = typeof config;
