import { Offer } from './offer.model.js';

export const getMany = async (req, res) => {
  const offers = await Offer.find({});
  res.status(200).json({ data: offers });
};

export const getOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const offer = await Offer.findOneById(req.params.id);
    res.status(200).json({ data: offer });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not find offer with the specified ID' });
  }
};

export const updateOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const updatedOffer = await Offer.findOneByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(200).json({ data: updatedOffer });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not update offer with the specified ID' });
  }
};

export const removeOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const removedOffer = await Offer.findOneByIdAndRemove(req.params.id);
    res.status(200).json({ data: removedOffer });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not remove offer with the specified ID' });
  }
};

export const createOne = async (req, res) => {
  try {
    const createdOffer = await Offer.create(req.body);
    res.status(200).json({ data: createdOffer });
  } catch (error) {
    res.status(400).json({ error: 'Could not create offer' });
  }
};
