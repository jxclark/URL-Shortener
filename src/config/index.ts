import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
};

export default config;
