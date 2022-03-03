import { Router } from 'express';
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
} from './Offer.controller.js';
export const OfferRouter = Router();

OfferRouter.get('/', getMany);
OfferRouter.post('/', [offerCreateValidator, verifyFieldsErrors], createOne);
OfferRouter.get('/:id', getOne);
OfferRouter.patch(
  '/:id',
  [offerUpdateValidator, verifyFieldsErrors],
  updateOne,
);
OfferRouter.delete('/:id', removeOne);
