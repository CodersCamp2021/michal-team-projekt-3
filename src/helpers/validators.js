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

export const offerUpdateValidator = [
  body('title')
    .optional()
    .isLength({ min: 6, max: 255 })
    .withMessage('Invalid title length'),
  body('accomodationType').optional().isString(),
  body('description').optional().isString(),
  body('localisation.address')
    .optional()
    .isString()
    .isLength({ min: 2, max: 255 }),
  body('localisation.latitude').optional().isNumeric(),
  body('localisation.longitude').optional().isNumeric(),
  body('amenities').optional().isArray(),
  body('price').optional().isNumeric(),
  body('oldPrice').optional().isNumeric(),
  body('image').optional().isURL().withMessage('Invalid image URL format'),
  body('images').optional().isArray(),
  body('images.*').isURL().withMessage('Invalid image URL format'),
];

export const offerCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('localisation.address').notEmpty().withMessage('Address is required'),
  body('localisation.latitude').notEmpty().withMessage('Latitude is required'),
  body('localisation.longitude')
    .notEmpty()
    .withMessage('Longitude is required'),
  body('price').notEmpty().withMessage('Price is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  [...offerUpdateValidator],
];

export const userUpdateValidator = [
  body().custom((body) => {
    const allowedKeys = [
      'name',
      'lastName',
      'email',
      'password',
      'photo',
      'languages',
    ];
    for (const key of Object.keys(body)) {
      if (!allowedKeys.includes(key)) {
        throw new Error(`Not allowed property: ${key}`);
      }
    }
    return true;
  }),
  body('name').optional({ nullable: true }).isLength({ min: 2 }).isString(),
  body('lastName').optional({ nullable: true }).isLength({ min: 2 }).isString(),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Invalid email'),
  body('password').optional({ nullable: true }).isLength({ min: 8 }).isString(),
  body('photo').optional().isURL().withMessage('Invalid image URL format'),
  body('languages').optional({ nullable: true }),
];
