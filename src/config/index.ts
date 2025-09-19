import dotenv from 'dotenv';

dotenv.config();

const CORS_WHITELIST = ['http://localhost:3000'];
const _1H_IN_MILLISECONDS = 1000 * 60 * 60;
const _7DAYS_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7; // 7 days
const config = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  CORS_WHITELIST,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST!,
  WINDOW_MS: _1H_IN_MILLISECONDS,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI!,
  WHITELISTED_EMAILS: process.env.WHITELISTED_EMAILS
    ? JSON.parse(process.env.WHITELISTED_EMAILS)
    : [],
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  COOKIE_MAX_AGE: _7DAYS_IN_MILLISECONDS,
  JWT_PASSWORD_RESET_SECRET: process.env.JWT_PASSWORD_RESET_SECRET!,
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: process.env.EMAIL_PORT!,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN!,
};

export default config;
