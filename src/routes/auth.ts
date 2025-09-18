import { Router } from 'express';
import { body } from 'express-validator';

// Custom modules
import expressRateLimit from '@/lib/expressRateLimit';

// Controllers
import register from '@/controllers/auth/register';

// Middlwares
import validationError from '@/middlewares/validationErrors';

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
      // TODO: Do this process after configuring a "user" model
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

export default router;
