import { mailer } from '../helpers/nodemailer.js';
import { Offer } from '../offer/offer.model.js';
import { templateEmailWithoutButton } from '../Email/templateEmailWithoutButton.js';
import { User } from '../user/user.model.js';
import { Reservation } from './reservation.model.js';
import { createEmailDataObject } from '../Email/createEmailDataObject.js';

export async function createReservation(req, res) {
  const reservation = new Reservation({
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    object: req.body.object,
    user: req.user._id,
    message: req.body.message,
    payment: req.body.payment,
    contact: req.body.contact,
    price: req.body.price,
  });

  const { host: hostId, title: objTitle } = await Offer.findById(
    req.body.objectId,
  );
  const { email } = await User.findById(hostId);

  const htmlTemplateHost = templateEmailWithoutButton(
    `Confirmation of reservation at ${objTitle}`,
    `Your object ${objTitle} has been reserved from ${req.body.dateStart} to ${req.body.dateEnd}`,
  );

  const mailDataHost = createEmailDataObject(
    email,
    'Your object has been reservated.',
    htmlTemplateHost,
  );

  try {
    await reservation.save();
    await mailer.sendMail(mailDataHost);
    res.status(200).json({
      data: 'The object reservation has been successfully completed.',
    });
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

export async function getAllUserReservations(req, res) {
  try {
    const getAllUserReservations = await Reservation.find({
      user: req.user._id,
    });
    res.status(200).json({ data: getAllUserReservations });
  } catch (error) {
    res.status(400).json({
      message: 'Could not find reservation for user with this ID',
      error: [error],
    });
  }
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
