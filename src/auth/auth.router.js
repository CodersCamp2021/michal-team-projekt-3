import { Router } from 'express';
import { activateAccount, signin, signup } from './auth.controller.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import { registerValidator, loginValidator } from '../helpers/validators.js';

export const AuthRouter = Router();

AuthRouter.post('/register', [registerValidator, verifyFieldsErrors], signup);
AuthRouter.post('/login', [loginValidator, verifyFieldsErrors], signin);
AuthRouter.patch('/active-account', activateAccount);
