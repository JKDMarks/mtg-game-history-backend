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
            FRONTEND_URL: string;
            NODE_ENV: string;
            BACKEND_URL: string;
        }
    }
}

export {};
