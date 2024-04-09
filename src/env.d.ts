declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            SECRET_KEY: string;
            DATABASE_USER: string;
            DATABASE_PASSWORD: string;
            DATABASE: string;
            DATABASE_HOST: string;
            DATABASE_DIALECT: string;
            DATABASE_URL: string;
            CLIENT_COOKIE_VALUE: string;
            FRONTEND_URL: string;
            USE_HTTPS: string;
            NODE_ENV: string;
        }
    }
}

export {};
