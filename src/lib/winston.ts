import config from '@/config';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { createLogger, format, transport, transports } from 'winston';

// Initialize an array to hold all configured Winston transports
const transportation: transport[] = [];

// Throw error when source token or ingesting host is missing
if (!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST) {
  throw new Error('Logtail source token or ingesting host is missing');
}

// Create a Logtail instance for sending structured logs to a remote logging service
const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
  endpoint: config.LOGTAIL_INGESTING_HOST,
});

// In production environment, push LogtailTransport to winston transport.
if (config.NODE_ENV === 'development') {
  transportation.push(new LogtailTransport(logtail));
}

// Destructure logging format utilities from winston
const { colorize, combine, timestamp, label, printf } = format;

// In development environment, use console logging for real-time feedback
if (config.NODE_ENV === 'development') {
  transportation.push(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        label({ label: 'URL Shortener' }),
        timestamp({ format: 'MM DD YYYY hh:mm:ss A' }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

// Create a winston logger with the sele4cted transports
const logger = createLogger({
  transports: transportation,
});

export { logtail, logger };
