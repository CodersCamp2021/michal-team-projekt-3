import mongoose from 'mongoose';
import { Offer } from './offer.model.js';
import flatten from 'flat';
import { getSearchBoundingBox } from '../helpers/mapBox.js';
import { USER_ROLE } from '../constants.js';
import { setHostRole } from '../user/user.controller.js';

export const getMany = async (req, res) => {
  const filters = {};
  if (req.query.localisation) {
    try {
      const searchBoundingBox = await getSearchBoundingBox(
        req.query.localisation,
      );
      Object.assign(filters, {
        'localisation.longitude': {
          $gte: searchBoundingBox[0],
          $lte: searchBoundingBox[2],
        },
        'localisation.latitude': {
          $gte: searchBoundingBox[1],
          $lte: searchBoundingBox[3],
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: 'Could not get bounding box from MapBox',
        errors: [e],
      });
    }
  }

  if (req.query.minPrice || req.query.maxPrice) filters.price = {};

  req.query.minPrice &&
    Object.assign(filters.price, { $gte: parseFloat(req.query.minPrice) });
  req.query.maxPrice &&
    Object.assign(filters.price, { $lte: parseFloat(req.query.maxPrice) });
  req.query.accomodationTypes &&
    Object.assign(filters, {
      accomodationType: { $in: [].concat(req.query.accomodationTypes) },
    });
  req.query.hostLanguages &&
    Object.assign(filters, {
      'host.languages': { $in: [].concat(req.query.hostLanguages) },
    });

  const offers = await Offer.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'host',
        foreignField: '_id',
        as: 'host',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              lastName: 1,
              email: 1,
              photo: 1,
              languages: 1,
              responseTime: 1,
              rating: 1,
              hostFrom: 1,
              lastOnline: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: '$host',
    },
    {
      $match: filters,
    },
  ]);

  return res.status(200).json({ data: offers });
};

export const getOne = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });
  try {
    const offer = await Offer.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'host',
          foreignField: '_id',
          as: 'host',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                lastName: 1,
                email: 1,
                photo: 1,
                languages: 1,
                responseTime: 1,
                rating: 1,
                hostFrom: 1,
                lastOnline: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$host',
      },
    ]);
    if (offer && offer.length == 1)
      return res.status(200).json({ data: offer[0] });
    else throw new Error('Invalid database response');
  } catch (error) {
    return res.status(400).json({
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

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer.host.equals(req.user._id) && req.user.role !== USER_ROLE.ADMIN)
      return res.status(403).json({ message: 'Access denied', errors: [] });
  } catch (error) {
    return res.status(400).json({
      message: 'Could not find offer with the specified ID',
      errors: [error],
    });
  }

  try {
    const flattenedBody = flatten(req.body);
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      flattenedBody,
      { returnDocument: 'after' },
    );
    return res.status(200).json({ data: updatedOffer });
  } catch (error) {
    return res.status(400).json({
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

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer.host.equals(req.user._id) && req.user.role !== USER_ROLE.ADMIN)
      return res.status(403).json({ message: 'Access denied', errors: [] });
  } catch (error) {
    return res.status(400).json({
      message: 'Could not find offer with the specified ID',
      errors: [error],
    });
  }
  try {
    const removedOffer = await Offer.findByIdAndRemove(req.params.id);
    return res.status(200).json({ data: removedOffer });
  } catch (error) {
    return res.status(400).json({
      message: 'Could not remove offer with the specified ID',
      errors: [error],
    });
  }
};

export const createOne = async (req, res) => {
  try {
    const userId = req.user._id;
    const isUserOffersExists = await userOffersExists(userId);
    if (!isUserOffersExists) {
      await setHostRole(userId);
    }
    const createdOffer = await Offer.create({
      ...req.body,
      host: userId,
    });
    return res.status(200).json({ data: createdOffer });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Could not create offer', errors: [error] });
  }
};

export const userOffersExists = async (userId) => {
  const offers = await Offer.find({ host: userId });
  if (!offers.length) return false;
  return true;
};
