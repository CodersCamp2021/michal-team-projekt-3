import { Router } from 'express';
import { requireAuth } from '../auth/passport.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import { USER_ROLE } from '../constants.js';
import {
  offerCreateValidator,
  offerUpdateValidator,
} from '../helpers/validators.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import {
  getMany,
  getOne,
  updateOne,
  removeOne,
  createOne,
} from './offer.controller.js';
export const OfferRouter = Router();

OfferRouter.get('/', getMany);
OfferRouter.post(
  '/',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN, USER_ROLE.HOST]),
  [offerCreateValidator, verifyFieldsErrors],
  createOne,
);
OfferRouter.get('/:id', getOne);
OfferRouter.patch(
  '/:id',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN, USER_ROLE.HOST]),
  [offerUpdateValidator, verifyFieldsErrors],
  updateOne,
);
OfferRouter.delete(
  '/:id',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN, USER_ROLE.HOST]),
  removeOne,
);
