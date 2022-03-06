import { Offer } from './offer.model.js';
import flatten from 'flat';
import { USER_ROLE } from '../constants.js';

export const getMany = async (req, res) => {
  const offers = await Offer.find({});
  res.status(200).json({ data: offers });
};

export const getOne = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });
  try {
    const offer = await Offer.findById(req.params.id);
    res.status(200).json({ data: offer });
  } catch (error) {
    res.status(400).json({
      message: 'Could not find offer with the specified ID',
      errors: [error],
    });
  }
};

export const updateOne = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });

  const offer = await Offer.findById(req.params.id);

  if (!offer.host.equals(req.user._id) && req.user.role !== USER_ROLE.ADMIN)
    return res.status(400).json({ message: 'Access denied', errors: [] });

  try {
    const flattenedBody = flatten(req.body);
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      flattenedBody,
      { returnDocument: 'after' },
    );
    res.status(200).json({ data: updatedOffer });
  } catch (error) {
    res.status(400).json({
      message: 'Could not update offer with the specified ID',
      errors: [error],
    });
  }
};

export const removeOne = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });

  const offer = await Offer.findById(req.params.id);

  if (!offer.host.equals(req.user._id) && req.user.role !== USER_ROLE.ADMIN)
    return res.status(400).json({ message: 'Access denied', errors: [] });

  try {
    const removedOffer = await Offer.findByIdAndRemove(req.params.id);
    res.status(200).json({ data: removedOffer });
  } catch (error) {
    res.status(400).json({
      message: 'Could not remove offer with the specified ID',
      errors: [error],
    });
  }
};

export const createOne = async (req, res) => {
  try {
    const createdOffer = await Offer.create({
      ...req.body,
      host: req.user._id,
    });
    res.status(200).json({ data: createdOffer });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Could not create offer', errors: [error] });
  }
};
