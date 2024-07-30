import { Config } from './configs.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT) || 5433,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  telegramBot: {
    secretToken: process.env.SECRET_TOKEN,
    domain: process.env.WEBHOOK_DOMAIN,
    token: process.env.BOT_TOKEN,
    webAppUrl: process.env.WEB_APP_URL,
  },
});
