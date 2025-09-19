// Custom modules
import { logger } from '@/lib/winston';

//Models
import User from '@/models/user';

//Types
import type { Request, Response } from 'express';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  try {
    // TODO: Delete all links accosciated with current user

    await User.deleteOne({ _id: userId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error during deleting current user', error);
  }
};

export default deleteCurrentUser;
