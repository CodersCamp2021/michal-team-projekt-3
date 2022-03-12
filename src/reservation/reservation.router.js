import { Router } from 'express';
import { USER_ROLE } from '../constants.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import { requireAuth } from '../auth/passport.js';

import {
  createReservation,
  getSingleReservationData,
  deleteReservation,
  getAllReservations,
  updateReservation,
  getAllUserReservations,
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post('/', requireAuth, createReservation);

ReservationRouter.get(
  '/',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN]),
  getAllReservations,
);

ReservationRouter.get('/:id', requireAuth, getAllUserReservations);

ReservationRouter.get('/:id', requireAuth, getSingleReservationData);

ReservationRouter.patch('/:id', requireAuth, updateReservation);

ReservationRouter.delete(
  '/:id',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN]),
  deleteReservation,
);
