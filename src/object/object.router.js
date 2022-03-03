import { Router } from 'express';
import {
  objectCreateValidator,
  objectUpdateValidator,
} from '../helpers/validators.js';
import { verifyFieldsErrors } from '../middlewares/validation.middleware.js';
import {
  getMany,
  getOne,
  updateOne,
  removeOne,
  createOne,
} from './object.controller.js';
export const ObjectRouter = Router();

ObjectRouter.get('/', getMany);
ObjectRouter.post('/', [objectCreateValidator, verifyFieldsErrors], createOne);
ObjectRouter.get('/:id', getOne);
ObjectRouter.patch(
  '/:id',
  [objectUpdateValidator, verifyFieldsErrors],
  updateOne,
);
ObjectRouter.delete('/:id', removeOne);
