/**
 * @copyright 2025 weirdlookingjay
 * @license Apache-2.0
 */

import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import config from '@/config';
import router from '@/routes';

const server = express();

/**
 * Secure headers
 */
server.use(helmet());

/**
 * PArse JSON request bodies
 */
server.use(express.json());

/**
 * Parse URL enncoded  odies
 */
server.use(express.urlencoded({ extended: true }));

/**
 * Set the public folder
 */
server.use(express.static(`${__dirname}/public`));

/**
 * Cookie parser
 */
server.use(cookieParser());

/**
 * Compress response
 */
server.use(compression());

// Immmeditately Invoked Async Function to initialize the application
(async function (): Promise<void> {
  try {
    server.use('/', router);

    server.listen(config.PORT, () => {
      console.log(`Server is listening at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// Handles graceful server shutdown on termination signals
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    console.log('Server shutdown', signal);
    process.exit(0);
  } catch (error) {
    console.error('Failed to shutdown the server', error);
  }
};

// List for termination signals and trigger graceful shutdown
process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);
