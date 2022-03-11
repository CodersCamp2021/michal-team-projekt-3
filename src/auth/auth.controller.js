import { User } from '../user/user.model.js';
import { createToken } from './jwt.service.js';

export const signup = async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    const token = createToken(user._id);
    return res.status(201).json({
      message: 'Registered successfully',
      token: `Bearer ${token}`,
    });
  } catch (error) {
    return res.status(400).json({ errors: [error.message] });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = createToken(user._id);
    return res
      .status(201)
      .json({ message: 'Logged in successfully', token: `Bearer ${token}` });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errors: [error.message] });
  }
};

export const protectedController = (req, res) => {
  res.status(200).json({
    message: 'protected route',
  });
};
