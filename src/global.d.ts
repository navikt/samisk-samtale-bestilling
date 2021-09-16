declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_BASEPATH: string;
            APP_ORIGIN: string;
            ENV: string;
        }
    }
}

export {};
