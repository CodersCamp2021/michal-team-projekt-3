import { Router } from 'express';

import {
  makeReservation,
  getSingleReservationData,
  deleteReservation,
} from '../reservation/reservation.controllers';

export const ReservationRouter = Router();

// Make a reservation data by user

ReservationRouter.post('/reservation/:reservationID', async (req, res) => {
  try {
    const saveReservation = await makeReservation(req, res);
    //todo updating user to reservation
    // await updateUser(req, res, saveReservation);
    res.status(201).json(saveReservation);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//Get data of current Reservation
ReservationRouter.get('/:reservationID', async (req, res) => {
  try {
    const reservationData = await getSingleReservationData(req, res);
    res.status(200).send(reservationData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

//Delete current reservation by admin
ReservationRouter.delete('/:reservationID', async (req, res) => {
  try {
    const removeReservation = await deleteReservation(req, res);
    res.status(200).send(removeReservation);
  } catch (error) {
    res.status(502).res.json({ message: error });
  }
});
