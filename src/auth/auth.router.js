import { Router } from 'express';
import { signin, signup, protectedController } from './auth.controller.js';
import { verifyFieldsErrors } from '../utils/validation.middleware.js';
import { registerValidator, loginValidator } from '../utils/validators.js';
import passport from 'passport';

export const AuthRouter = Router();

AuthRouter.post('/register', [registerValidator, verifyFieldsErrors], signup);

AuthRouter.post('/login', [loginValidator, verifyFieldsErrors], signin);

AuthRouter.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  protectedController,
);
