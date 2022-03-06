import { body } from 'express-validator';
import { User } from '../user/user.model.js';

export const registerValidator = [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .isString(),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('lastName is required')
    .isLength({ min: 2 })
    .isString(),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            reject(new Error('Server Error'));
          }
          if (user) {
            reject(new Error('Email already taken'));
          }
          resolve(true);
        });
      });
    }),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .isString(),
  body('dob')
    .not()
    .isEmpty()
    .withMessage('Dob is required')
    .isDate()
    .withMessage('Invalid date format'),
];

export const loginValidator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .isString(),
];
