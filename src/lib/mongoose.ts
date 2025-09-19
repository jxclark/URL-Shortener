// Node modules
import mongoose from 'mongoose';

// Custom modules
import config from '@/config';
import { logger } from '@/lib/winston';

// Types
import type { ConnectOptions } from 'mongoose';

/**
 * Mongo connection options
 */
const connectionOptions: ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'shortly',
};

const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_CONNECTION_URI) {
    throw new Error('MONGO URI is not defined');
  }

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectionOptions);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', error);
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect from database', error);
  }
};

export { connectToDatabase, disconnectDatabase };
