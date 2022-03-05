import { Router } from 'express';

import {
  createReservation,
  getSingleReservationData,
  deleteReservation,
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post('/reservation/:reservationId', createReservation);

ReservationRouter.get('/:reservationId', getSingleReservationData);

ReservationRouter.delete('/:reservationId', deleteReservation);
