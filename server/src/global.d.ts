declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: 'prod' | 'dev' | 'localhost';
            DECORATOR_ENV: 'prod' | 'dev' | 'beta' | 'betaTms' | 'localhost' | 'prodNext';
            VITE_APP_BASEPATH: string;
            APP_PORT: string;
            NODE_ENV: 'development' | 'production';
        }
    }
}

export {};
