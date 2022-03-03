import { Reservation } from './reservation.model';

export async function makeReservation(req, res) {
  const reservation = new Reservation({
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    object: req.params.objectId,
  });
  try {
    const saveReservation = await reservation.save();
    if (!saveReservation) {
      res.status(400).json({ message: 'Data incorrect' });
    }
    return saveReservation;
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
}

export async function getSingleReservationData(req, res) {
  try {
    const reservationData = await Reservation.findById(
      req.params.reservationId,
    );
    if (!reservationData) {
      res.status(204).end();
    } else {
      return reservationData;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

export async function deleteReservation(req, res) {
  //todo - usuń jeżeli jest adminem
  try {
    const deleteReservation = await Reservation.deleteOne({
      _id: req.params.reservationId,
    });
    if (!deleteReservation) {
      res.status(404).json({ message: 'no reservation with this ID' });
    } else {
      return deleteReservation;
    }
  } catch (error) {
    res.status(502).res.json({ message: error });
  }
}
