// Custom modules
import config from '@/config';
import { logger } from '@/lib/winston';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

// Models
import User from '@/models/user';

// Types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
type RequestBody = Pick<IUser, 'email'>;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RequestBody;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return;

    const refreshToken = generateRefreshToken({ userId: user._id });
    const accessToken = generateAccessToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Error logging in', error);
  }
};

export default login;
