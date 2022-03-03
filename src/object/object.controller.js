import { Object } from './object.model.js';

export const getMany = async (req, res) => {
  const objects = await Object.find({});
  res.status(200).json({ data: objects });
};

export const getOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const object = await Object.findOneById(req.params.id);
    res.status(200).json({ data: object });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not find object with the specified ID' });
  }
};

export const updateOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const updatedObject = await Object.findOneByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(200).json({ data: updatedObject });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not update object with the specified ID' });
  }
};

export const removeOne = async (req, res) => {
  if (!req.params.id)
    res.status(400).json({ error: 'Bad request: no ID param' });
  try {
    const removedObject = await Object.findOneByIdAndRemove(req.params.id);
    res.status(200).json({ data: removedObject });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Could not remove object with the specified ID' });
  }
};

export const createOne = async (req, res) => {
  try {
    const createdObject = await Object.create(req.body);
    res.status(200).json({ data: createdObject });
  } catch (error) {
    res.status(400).json({ error: 'Could not create object' });
  }
};
