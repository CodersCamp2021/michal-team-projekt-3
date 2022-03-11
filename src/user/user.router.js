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

UserRouter.use(roleCheck([USER_ROLE.ADMIN]));
UserRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);
