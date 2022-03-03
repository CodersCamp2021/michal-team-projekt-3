import { Router } from 'express';
import { signin, signup, protectedController } from './auth.controller.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import { registerValidator, loginValidator } from '../helpers/validators.js';
import passport from 'passport';

export const AuthRouter = Router();

AuthRouter.post('/register', [registerValidator, verifyFieldsErrors], signup);

AuthRouter.post('/login', [loginValidator, verifyFieldsErrors], signin);

AuthRouter.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  protectedController,
);
