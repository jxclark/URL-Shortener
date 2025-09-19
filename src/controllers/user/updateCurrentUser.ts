// Node modules
import bcrypt from 'bcrypt';

// Custom modules
import { logger } from '@/lib/winston';

//Models
import User from '@/models/user';

//Types
import type { Request, Response } from 'express';

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  const requestToUpdate = req.body;
  if (requestToUpdate.new_password) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(requestToUpdate.new_password, salt);
    requestToUpdate.password = hashPassword;
  }
  try {
    await User.updateOne({ _id: userId }, requestToUpdate);

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error updating current user', error);
  }
};

export default updateCurrentUser;
