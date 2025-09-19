// Node modules
import bcrypt from 'bcrypt';

// Custom modules
import config from '@/config';
import { logger } from '@/lib/winston';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

// Utils
import { generateMongooseId } from '@/utils';

// Models
import User from '@/models/user';

// Types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
type RequestBody = Pick<IUser, 'name' | 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as RequestBody;

  // Handle case when random user wants to create an admin account
  if (role === 'admin' && !config.WHITELISTED_EMAILS?.includes(email)) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'You are not authorized to create an admin account',
    });

    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const userId = generateMongooseId();

    const refreshToken = generateRefreshToken({ userId });
    const accessToken = generateAccessToken({ userId });

    const user = await User.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      refreshToken,
    });

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
        passwordResetToken: user.passwordResetToken,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Failed to register user', error);
  }
};

export default register;
