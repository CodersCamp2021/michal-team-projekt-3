import { Reservation } from './reservation.model.js';

export async function createReservation(req, res) {
  const reservation = new Reservation({
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    object: req.body.objectId,
    user: req.user._id,
    message: req.body.message,
    payment: req.body.payment,
    contact: req.body.contact,
  });
  try {
    const createdReservation = await reservation.save();
    res.status(200).json({ data: createdReservation });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Could not create reservation', errors: [error] });
  }
}

export async function getSingleReservationData(req, res) {
  if (!req.params.id)
    res.status(400).json({ message: 'Bad request: no ID param', errors: [] });
  try {
    const reservationData = await Reservation.findOneById(req.params.id);
    res.status(200).json({ data: reservationData });
  } catch (error) {
    res.status(400).json({
      message: 'Could not find reservation with this specified ID',
      errors: [error],
    });
  }
}

export async function updateReservation(req, res) {
  if (req.params.id)
    res.status(400).json({ message: 'Bad request: no ID param', errors: [] });

  try {
    const updateReservation = await Reservation.findOneByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(200).json({ data: updateReservation });
  } catch (error) {
    res.status(400).json({
      message: 'Could not update reservation with specified ID',
      errors: [error],
    });
  }
}

export async function getAllReservations(req, res) {
  const reservations = await Reservation.find({});
  res.status(200).json({ data: reservations });
}

export async function deleteReservation(req, res) {
  if (!req.params.id)
    res.status(400).json({ message: 'Bad request: no ID param', errors: [] });
  try {
    const deletedReservation = await Reservation.findOneByIdAndRemove(
      req.params.id,
    );
    res.status(200).json({ data: deletedReservation });
  } catch (error) {
    res.status(400).json({
      message: 'Could not remove reservation with the specified ID',
      errors: [error],
    });
  }
}
