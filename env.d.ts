declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABSE_URL: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DATABASE: string;
    PORT: string;
    BCRYPT_SALT: string;
    JWT_SECRET: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    IMAGE_PROFILE_DEFAULT_URL: string;
    BASE_IMAGE_URL: string;
  }
}
