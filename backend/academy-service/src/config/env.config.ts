import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8002,
  databaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/simplearn_academy',
  jwtSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access_secret',
};
