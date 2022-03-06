import { User } from './user.model.js';

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndRemove(id);

  if (user)
    return res
      .status(200)
      .send({ message: 'User has been successfully deleted.' });

  return res.status(404).send({ message: 'User with this ID does not exist.' });
};

export const deleteMe = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndRemove(_id);

  return res.status(200).send({ message: 'success' });
};
