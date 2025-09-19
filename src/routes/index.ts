import { Router } from 'express';

const router = Router();

/**
 * Routes
 */
import authRoute from '@/routes/auth';
import userRoute from '@/routes/user';

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://github.com/jxclark/URL-Shortener',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoute);

// User routes
router.use('/users', userRoute);

export default router;
