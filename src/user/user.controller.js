import { User } from './user.model.js';
import flatten from 'flat';

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndRemove(id);
  if (user)
    return res
      .status(200)
      .json({ message: `User with id: ${id} has been successfully deleted` });

  return res.status(404).json({ message: 'User with this ID does not exist.' });
};

export const deleteMe = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndRemove(_id);

  return res
    .status(200)
    .json({ message: `User with id: ${_id} has been successfully deleted` });
};

export const getMe = (req, res) => {
  const userData = User.selectFields(req.user);
  return res.status(200).json({ data: userData });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        createdAt: 0,
        updatedAt: 0,
        password: 0,
      },
    );
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};

export const getUserById = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });
  }
  try {
    const user = await User.findById(req.params.id, {
      createdAt: 0,
      updatedAt: 0,
      password: 0,
    });
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};

export const updateMe = async (req, res) => {
  try {
    const flattenedBody = flatten(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      flattenedBody,
      {
        returnDocument: 'after',
      },
    );
    const userData = User.selectFields(updatedUser);
    res.status(200).json({ data: userData });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};

export const updateUser = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: 'Bad request: no ID param', errors: [] });
  }
  try {
    const flattenedBody = flatten(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      flattenedBody,
      {
        returnDocument: 'after',
      },
    );
    const userData = User.selectFields(updatedUser);
    res.status(200).json({ data: userData });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};
