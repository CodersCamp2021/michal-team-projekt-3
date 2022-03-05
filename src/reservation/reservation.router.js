import { Router } from 'express';

import {
  createReservation,
  getSingleReservationData,
  deleteReservation,
  getAllReservations,
  updateReservation,
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post('/reservation/:reservationId', createReservation);

ReservationRouter.get('/reservation', getAllReservations);

ReservationRouter.get('/:reservationId', getSingleReservationData);

ReservationRouter.patch('/:reservationId', updateReservation);

ReservationRouter.delete('/:reservationId', deleteReservation);
