import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validationError = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      errors: errors.mapped(),
    });
    return;
  }
  next();
};

export default validationError;
