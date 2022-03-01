import { User } from '../user/user.model.js';
import { createToken } from './jwt.service.js';

export const signup = async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    return res.status(201).send({
      message: 'Registered successfully',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid password' });
    }
    const token = createToken(user);
    return res
      .header('Authorization', `Bearer ${token}`)
      .status(201)
      .send({ message: 'Logged in successfully', token });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export const protectedController = (req, res) => {
  res.status(200).send({
    message: 'protected route',
  });
};
