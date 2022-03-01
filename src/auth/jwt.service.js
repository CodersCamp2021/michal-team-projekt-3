import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};
