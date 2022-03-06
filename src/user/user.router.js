import { Router } from 'express';
import { requireAuth } from '../auth/passport.js';
import { USER_ROLE } from '../constants.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import { deleteMe, deleteUser } from './user.controller.js';

export const UserRouter = Router();

UserRouter.delete('/me', requireAuth, deleteMe);

UserRouter.delete(
  '/:id',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN]),
  deleteUser,
);
