export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  telegramBot: TelegramBotConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type TelegramBotConfig = {
  domain: string;
  secretToken: string;
  token: string;
  webAppUrl: string;
};
