import { createToken, verifyToken } from '../auth/jwt.service.js';
import { User } from './user.model.js';
import flatten from 'flat';
import { mailer } from '../helpers/nodemailer.js';
import { templateGenrator } from '../templateEmail/templateEmail.js';
import { USER_ROLE } from '../constants.js';

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: 'User with this email does not exist.' });
  }

  const resetToken = createToken(user._id, '15m');
  await user.updateOne({ resetToken: resetToken });

  const htmlTemplate = templateGenrator(
    'Reset your password!',
    'Need to reset your password? No problem! Just click the button below and you will be on your way. If you did not make this request, please ignore this email.',
    `${process.env.FE_URL}/reset-password?resetId=${resetToken}`,
    'Reset Password',
  );

  const mailData = {
    from: `"Bking" <noreply.bking@gmail.com>`,
    to: email,
    subject: 'Reset your password',
    html: htmlTemplate,
  };

  try {
    await mailer.sendMail(mailData);
    return res
      .status(200)
      .json({ message: 'Email has been sent, follow the instructions!' });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Something went wrong :(', errors: [error.message] });
  }
};

export const resetPassword = async (req, res) => {
  const { password, resetToken } = req.body;

  const isCorrectToken = verifyToken(resetToken);
  if (!isCorrectToken) {
    return res.status(401).json({ message: 'Your token is expired.' });
  }

  const user = await User.findOne({ resetToken });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' });
  }
  await user.updateOne({ password: password, resetToken: '' });
  return res.status(200).json({
    message: 'Your password has been successfully changed. You can login now.',
  });
};

export const setHostRole = async (id) => {
  try {
    await User.findByIdAndUpdate(id, {
      role: USER_ROLE.HOST,
    });
  } catch (error) {
    console.error(error.message);
  }
};
