declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_URL: string;
            APP_BASEPATH: string;
            APP_ORIGIN: string;
            ENV: string;
            KONTAKTINFO_API_URL: string;
        }
    }
}

export {};
