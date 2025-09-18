import dotenv from 'dotenv';

dotenv.config();

const CORS_WHITELIST = ['http://localhost:3000'];
const _1H_IN_MILLISECONDS = 1000 * 60 * 60;
const config = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  CORS_WHITELIST,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST!,
  WINDOW_MS: _1H_IN_MILLISECONDS,
};

export default config;
