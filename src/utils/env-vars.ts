import { cleanEnv, host, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'testing', 'production', 'staging'],
    default: 'development'
  }),
  HOST: host({ default: 'localhost' }),
  PORT: port({ default: 8282 }),
  APP_NAME: str({ default: 'HelloBuddy' }),

  CORS_ORIGINS: str({ default: 'http://localhost:3000' }),
  JWT_SECRET: str({ default: '5Cc5t3DB1LwRHt099RedKT' }),

  DB_HOST: host({ default: 'localhost' }),
  DB_NAME: str({ default: 'hellobuddy-db' }),
  DB_PORT: port({ default: 5432 }),
  DB_USER: str({ default: 'postgres' }),
  DB_PASS: str({ default: 'postgres' }),

  REDIS_HOST: host({ default: 'localhost' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASS: str({ default: '' })
});

export default env;
