// Mode modules
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';

// Custom modules
import validationError from '@/middlewares/validationErrors';
import expressRateLimit from '@/lib/expressRateLimit';

// Controllers
import getCurrentUser from '@/controllers/user/getCurrentUser';
import deleteCurrentUser from '@/controllers/user/deleteCurrentUser';
import updateCurrentUser from '@/controllers/user/updateCurrentUser';

// Middlwares
import authentication from '@/middlewares/authentication';
import authorization from '@/middlewares/authorization';

// Models
import User from '@/models/user';

const router = Router();

(async () => {
  const authzMiddleware = await authorization(['user', 'admin']);
  router.get(
    '/current',
    expressRateLimit('basic'),
    authentication,
    authzMiddleware,
    getCurrentUser,
  );

  router.delete(
    '/current',
    expressRateLimit('basic'),
    authentication,
    authzMiddleware,
    deleteCurrentUser,
  );

  router.patch(
    '/current',
    expressRateLimit('basic'),
    authentication,
    body('name').optional(),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Invalid email address')
      .custom(async (email, { req }) => {
        const userId = req.userId;
        const isDuplicate = await User.exists({
          _id: { $ne: userId },
          email,
        }).exec();
        if (isDuplicate) {
          throw new Error('This email address is already in use');
        }
        return true;
      }),
    body('current_password')
      .optional()
      .custom(async (currentPassword, { req }) => {
        const userId = req.userId;

        const user = await User.findById(userId)
          .select('password')
          .lean()
          .exec();
        if (!user) return;
        const passwordIsValid = await bcrypt.compare(
          currentPassword,
          user.password,
        );
        if (!passwordIsValid) throw new Error('Current password is incorrect');
      }),
    body('new_password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password is too short'),
    body('role')
      .optional()
      .custom(() => {
        throw new Error('You do not have permission to the update role');
      }),
    validationError,
    authzMiddleware,
    updateCurrentUser,
  );
})();

export default router;
