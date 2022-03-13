import { mailer } from '../helpers/nodemailer.js';
import { templateGenrator } from '../templateEmail/templateEmail.js';
import { User } from '../user/user.model.js';
import { createToken, verifyToken } from './jwt.service.js';

export const signup = async (req, res) => {
  const user = await new User(req.body);
  await user.save();
  const activateToken = createToken(user._id, '8h');
  await user.updateOne({ activateToken: activateToken });

  const htmlTemplate = templateGenrator(
    'Activate your account!',
    'Click the button below to activate your account',
    `${process.env.FE_URL}/active-account?activeIt=${activateToken}`,
  );

  const mailData = {
    from: `"Bking" <noreply.bking@gmail.com>`,
    to: req.body.email,
    subject: 'Activate your account',
    html: htmlTemplate,
  };

  try {
    await mailer.sendMail(mailData);
    return res.status(201).json({
      message:
        'Your account has been successfully created. Go to your email and click the activation button.',
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

    if (!user.isActive) {
      return res
        .status(400)
        .json({ message: 'Your account has not been activated yet' });
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

export const activateAccount = async (req, res) => {
  const { activateToken } = req.body;

  const isCorrectToken = verifyToken(activateToken);
  if (!isCorrectToken) {
    return res.status(401).json({ message: 'Your token is expired.' });
  }

  const user = await User.findOne({ activateToken });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' });
  }
  await user.updateOne({ isActive: true, activateToken: '' });
  return res.status(200).json({
    message: 'Your account has been successfully activated. You can login now.',
  });
};
