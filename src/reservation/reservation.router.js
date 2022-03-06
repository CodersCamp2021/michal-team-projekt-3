import { Router } from 'express';

import {
  createReservation,
  getSingleReservationData,
  deleteReservation,
  getAllReservations,
  updateReservation,
} from '../reservation/reservation.controllers.js';

export const ReservationRouter = Router();

ReservationRouter.post('/', createReservation);

ReservationRouter.get('/', getAllReservations);

ReservationRouter.get('/:id', getSingleReservationData);

ReservationRouter.patch('/:id', updateReservation);

ReservationRouter.delete('/:id', deleteReservation);
