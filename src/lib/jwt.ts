// Node modules
import jwt from 'jsonwebtoken';

// Custom modules
import config from '@/config';

// Types
import type { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export type TokenPayload = { userId: Types.ObjectId };
export type ResetLinkPayload = { email: string };

const generateAccessToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: '30m',
  });

  return token;
};

const generateRefreshToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return token;
};

// Generate a JWT token for reset password
const generateResetPasswordToken = (payload: ResetLinkPayload) => {
  const resetToken = jwt.sign(payload, config.JWT_PASSWORD_RESET_SECRET, {
    expiresIn: '1h',
  });

  return resetToken;
};

const verifyAccessToken = (accesstoken: string): string | JwtPayload => {
  return jwt.verify(accesstoken, config.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (refreshToken: string): string | JwtPayload => {
  return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
};

// Verify password reset token
const verifyPasswordResetToken = (resetToken: string): string | JwtPayload => {
  return jwt.verify(resetToken, config.JWT_PASSWORD_RESET_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
};
