import { Reservation } from './reservation.model.js';

export async function createReservation(req, res) {
  const reservation = new Reservation({
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    user: req.params.userID,
    object: req.params.objectId,
  });
  try {
    const createdReservation = await reservation.create(req.body);
    res.status(200).json({ data: createdReservation });
  } catch (error) {
    res.status(400).json({ message: 'Could not create reservation' });
  }
}

export async function getSingleReservationData(req, res) {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const reservationData = await Reservation.findOneById(req.params.id);
    res.status(200).json({ data: reservationData });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not find reservation with this specified ID' });
  }
}

export async function updateReservation(req, res) {
  if (req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });

  try {
    const updateReservation = await Reservation.findOneByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(200).json({ data: updateReservation });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not update reservation with specified ID' });
  }
}

export async function getAllReservations(req, res) {
  const reservations = await Reservation.find({});
  res.status(200).json({ data: reservations });
}

export async function deleteReservation(req, res) {
  //todo - usuń jeżeli jest adminem
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const deletedReservation = await Reservation.findOneByIdAndRemove(
      req.params.id,
    );
    res.status(200).json({ data: deletedReservation });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not remove reservation with the specified ID' });
  }
}
