import { Router } from 'express';
import { requireAuth } from '../auth/passport.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import { userUpdateValidator } from '../helpers/validators.js';
import { USER_ROLE } from '../constants.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import {
  deleteMe,
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  updateMe,
  updateUser,
} from './user.controller.js';

export const UserRouter = Router();

UserRouter.use(requireAuth);

UserRouter.route('/').get(roleCheck([USER_ROLE.ADMIN]), getUsers);

UserRouter.route('/me')
  .get(getMe)
  .patch([userUpdateValidator, verifyFieldsErrors], updateMe)
  .delete(deleteMe);

UserRouter.route('/:id')
  .get(roleCheck([USER_ROLE.ADMIN]), getUserById)
  .patch(roleCheck([USER_ROLE.ADMIN]), updateUser)
  .delete(roleCheck([USER_ROLE.ADMIN]), deleteUser);
