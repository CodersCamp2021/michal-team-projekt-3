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
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post('/', requireAuth, createReservation);

ReservationRouter.get(
  '/',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN]),
  getAllReservations,
);

ReservationRouter.get('/:id', getSingleReservationData);

ReservationRouter.patch('/:id', updateReservation);

ReservationRouter.delete(
  '/:id',
  requireAuth,
  roleCheck([USER_ROLE.ADMIN]),
  deleteReservation,
);
