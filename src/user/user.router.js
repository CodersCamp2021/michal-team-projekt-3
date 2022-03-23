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
  forgotPassword,
  resetPassword,
  updatePasswordMe,
} from './user.controller.js';

export const UserRouter = Router();

UserRouter.patch('/forgotPassword', forgotPassword);
UserRouter.patch('/resetPassword', resetPassword);

UserRouter.use(requireAuth);
UserRouter.delete('/me', requireAuth, deleteMe);

UserRouter.route('/').get(roleCheck([USER_ROLE.ADMIN]), getUsers);
UserRouter.route('/me')
  .get(getMe)
  .patch([userUpdateValidator, verifyFieldsErrors], updateMe)
  .delete(deleteMe);

UserRouter.route('/passwordMe').patch(
  [userUpdateValidator, verifyFieldsErrors],
  updatePasswordMe,
);

UserRouter.use(roleCheck([USER_ROLE.ADMIN]));
UserRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);
