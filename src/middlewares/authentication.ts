// Custom modules
import { logger } from '@/lib/winston';
import { verifyAccessToken } from '@/lib/jwt';

// Types
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { TokenPayload } from '@/lib/jwt';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({
      code: 'AccessTokenError',
      message: 'Access token is missing',
    });
    return;
  }

  const [_, accessToken] = authorization.split(' ');

  try {
    // Get the userId from jwt payload
    const { userId } = verifyAccessToken(accessToken) as TokenPayload;

    // Send the userId to the next controller function
    req.userId = userId;
    next();
  } catch (error) {
    // Handke case when accessToken expired
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AccessTokenExpired',
        message: 'Access token is expired',
      });
      return;
    }

    // Handle case when accessToken is invalid
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AccessTokenError',
        message: 'Access token is invalid',
      });
      return;
    }

    // Response with a 500 sttaus for unexpected errors
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error while authenticating a user', error);
  }
};

export default authentication;
