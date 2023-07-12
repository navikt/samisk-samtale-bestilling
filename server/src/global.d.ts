declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: 'prod' | 'dev' | 'localhost';
            APP_BASEPATH: string;
            APP_PORT: string;
        }
    }
}

export {};
