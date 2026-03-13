import { createLogger } from '@simplearn/logger';
import morgan, { StreamOptions } from 'morgan';

// Create Winston logger
export const logger = createLogger('auth-service');

// Create a stream object with a 'write' function that will be used by `morgan`
const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

// Morgan middleware
export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream },
);
