import { Router } from 'express';
import passport from 'passport';
import { USER_ROLE } from '../constants.js';
import { roleCheck } from '../middlewares/roleCheck.js';

import {
  createReservation,
  getSingleReservationData,
  deleteReservation,
  getAllReservations,
  updateReservation,
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createReservation,
);

ReservationRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    roleCheck(req, res, next, [USER_ROLE.ADMIN]);
  },
  getAllReservations,
);

ReservationRouter.get('/:id', getSingleReservationData);

ReservationRouter.patch('/:id', updateReservation);

ReservationRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    roleCheck(req, res, next, [USER_ROLE.ADMIN]);
  },
  deleteReservation,
);
