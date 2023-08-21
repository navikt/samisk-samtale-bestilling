/// <reference types="vite/client" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_URL: string;
            VITE_APP_BASEPATH: string;
            VITE_APP_ORIGIN: string;
            ENV: string;
            DECORATOR_LOCAL_URL: string;
            VITE_KONTAKTINFO_API_URL: string;
        }
    }

    interface ImportMeta {
        env: {
            VITE_APP_BASEPATH: string;
        };
    }
}

export {};
