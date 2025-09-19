import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';

// Custom modules
import expressRateLimit from '@/lib/expressRateLimit';

// Controllers
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import refreshToken from '@/controllers/auth/refreshToken';
import forgotPassword from '@/controllers/auth/forgotPassword';
import resetPassword from '@/controllers/auth/resetPassword';

// Middlwares
import validationError from '@/middlewares/validationErrors';
import authentication from '@/middlewares/authentication';

// Models
import User from '@/models/user';

const router = Router();

router.post(
  '/register',
  expressRateLimit('basic'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value }).exec();

      if (userExists) {
        throw new Error('This emaik address is already in use');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password is too short'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
  validationError,
  register,
);

router.post(
  '/login',
  expressRateLimit('auth'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const user = await User.exists({ email }).exec();

      if (!user) {
        throw new Error('User not found with this email');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password is too short')
    .custom(async (password, { req }) => {
      const { email } = req.body;

      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) return;

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new Error('Invalid Password');
      }
    }),
  validationError,
  login,
);

router.delete('/logout', expressRateLimit('basic'), authentication, logout);

router.get('/refresh-token', expressRateLimit('basic'), refreshToken);

router.post(
  '/forgot-password',
  expressRateLimit('basic'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const userExists = await User.exists({ email }).exec();

      if (!userExists) {
        throw new Error('User not found with this email');
      }
    }),
  validationError,
  forgotPassword,
);

router.post(
  '/reset-password',
  expressRateLimit('basic'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password is too short'),
  validationError,
  resetPassword,
);

export default router;
