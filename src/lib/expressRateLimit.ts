import config from '@/config';

import { rateLimit } from 'express-rate-limit';

// Types
import type { RateLimitRequestHandler, Options } from 'express-rate-limit';
type RateLimitType = 'basic' | 'auth' | 'passReset';

// Default limit configuration applied for all types
const defaultLmitOpt: Partial<Options> = {
  windowMs: config.WINDOW_MS,
  legacyHeaders: false,
  standardHeaders: true,
};

// Map holding specific rate limit options based on type
const rateLimitOpt = new Map<string, Partial<Options>>([
  ['basic', { ...defaultLmitOpt, limit: 100 }],
  ['auth', { ...defaultLmitOpt, limit: 10 }],
  ['passReset', { ...defaultLmitOpt, limit: 3 }],
]);

// Function to get rate limit middleware based on type
const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  return rateLimit(rateLimitOpt.get(type));
};

export default expressRateLimit;
