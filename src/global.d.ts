/// <reference types="vite/client" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_URL: string;
            APP_BASEPATH: string;
            APP_ORIGIN: string;
            ENV: string;
            DECORATOR_LOCAL_URL: string;
            KONTAKTINFO_API_URL: string;
        }
    }

    interface ImportMeta {
        env: {
            APP_BASEPATH: string;
        };
    }
}

export {};
