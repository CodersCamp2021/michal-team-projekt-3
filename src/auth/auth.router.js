import { Router } from 'express';
import {
  signin,
  activateAccount,
  signup,
  getNewAccessToken,
  signout,
} from './auth.controller.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import { registerValidator, loginValidator } from '../helpers/validators.js';
import { requireAuth } from './passport.js';

export const AuthRouter = Router();

AuthRouter.post('/register', [registerValidator, verifyFieldsErrors], signup);
AuthRouter.post('/login', [loginValidator, verifyFieldsErrors], signin);
AuthRouter.patch('/active-account', activateAccount);
AuthRouter.post('/token', getNewAccessToken);
AuthRouter.get('/logout', requireAuth, signout);
