// Custom modules
import config from '@/config';
import { logger } from '@/lib/winston';

// Models
import User from '@/models/user';

// Types
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  // Remove the userId from request
  const userId = req.userId;

  try {
    // Set current refreshToken to null
    await User.updateOne({ _id: userId }, { refreshToken: null });

    // Clear the cookie from client
    res.clearCookie('refreshToken', {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    // Response success with no content
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Error logging out', error);
  }
};

export default logout;
