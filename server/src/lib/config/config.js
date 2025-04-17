import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV
};

export default config;
