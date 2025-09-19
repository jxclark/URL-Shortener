// Custom mdoules
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateResetPasswordToken } from '@/lib/jwt';
import nodemailerTransport from '@/lib/nodemailer';
import { resetLinkTemplate } from '@/mailTemplates/resetLink';

// Models
import User from '@/models/user';

// Types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
type RequestBody = Pick<IUser, 'email'>;

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RequestBody;

  try {
    const passwordResetToken = generateResetPasswordToken({ email });

    const user = await User.findOneAndUpdate({ email })
      .select('name passwordResetToken')
      .exec();

    if (!user) return;

    await nodemailerTransport.sendMail({
      from: '"Shortly" <coder@weirdlookingjay.com>',
      to: email,
      subject: 'Password Reset Request',
      html: resetLinkTemplate({
        name: user.name,
        resetLink: `${config.CLIENT_ORIGIN}/reset-password?token=${passwordResetToken}`,
      }),
    });

    // Store the reset tokem in the user data and save
    user.passwordResetToken = passwordResetToken;
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error('Error during sending reset link to email', error);
  }
};

export default forgotPassword;
