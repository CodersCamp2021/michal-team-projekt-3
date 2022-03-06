import { Router } from 'express';
import passport from 'passport';
import { USER_ROLE } from '../constants.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import { deleteMe, deleteUser } from './user.controller.js';

export const UserRouter = Router();

UserRouter.delete(
  '/me',
  passport.authenticate('jwt', { session: false }),
  deleteMe,
);

UserRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  roleCheck([USER_ROLE.ADMIN]),
  deleteUser,
);
