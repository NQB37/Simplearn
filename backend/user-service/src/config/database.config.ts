import mongoose from 'mongoose';
import { config } from './env.config.js';

export const connectDB = async () => {
  try {
    const mongoURI = config.databaseUrl;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
