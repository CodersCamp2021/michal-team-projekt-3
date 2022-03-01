import { body } from 'express-validator';

export const registerValidator = [
  body('name').not().isEmpty().isLength({ min: 2 }).isString(),
  body('surname').not().isEmpty().isLength({ min: 2 }).isString(),
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty().isLength({ min: 8 }).isString(),
  body('dob').not().isEmpty().isDate(),
];

export const loginValidator = [
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty().isLength({ min: 8 }).isString(),
];
