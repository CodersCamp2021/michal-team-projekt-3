import { Offer } from './offer.model.js';
import flatten from 'flat';
import axios from 'axios';
import { USER_ROLE } from '../constants.js';
import { setHostRole } from '../user/user.controller.js';

export const getMany = async (req, res) => {
  const filters = {};
  if (req.query.localisation) {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.query.localisation}.json?&types=place&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
      );
      if (response.status === 200) {
        const searchBoundingBox = response.data.features[0].bbox;
        Object.assign(filters, {
          localisation: {
            longitude: {
              $gte: searchBoundingBox[0],
              $lte: searchBoundingBox[2],
            },
            latitude: {
              $gte: searchBoundingBox[1],
              $lte: searchBoundingBox[3],
            },
          },
        });
      } else
        return res
          .status(500)
          .json({ message: 'Wrong MapBox response code', errors: [] });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'MapBox request fail', errors: [e] });
    }
  }

  req.query.minPrice &&
    Object.assign(filters, { price: { $gte: req.query.minPrice } });
  req.query.maxPrice &&
    Object.assign(filters, { price: { $lte: req.query.maxPrice } });
  req.query.accomodationTypes &&
    Object.assign(filters, {
      accomodationType: { $in: req.query.accomodationTypes },
    });
  req.query.hostLanguages &&
    Object.assign(filters, {
      host: { languages: { $in: req.query.hostLanguages } },
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
    return res.status(403).json({ message: 'Access denied', errors: [] });

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
    return res.status(403).json({ message: 'Access denied', errors: [] });

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
    const userId = req.user._id;
    const isUserOffersExists = await userOffersExists(userId);
    if (!isUserOffersExists) {
      await setHostRole(userId);
    }
    const createdOffer = await Offer.create({
      ...req.body,
      host: userId,
    });
    res.status(200).json({ data: createdOffer });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Could not create offer', errors: [error] });
  }
};

export const userOffersExists = async (userId) => {
  const offers = await Offer.find({ host: userId });
  if (!offers.length) return false;
  return true;
};
