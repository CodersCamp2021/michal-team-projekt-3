import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { User } from '../user/user.model.js';

export const JwtConfig = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  const JwtStrategy = () =>
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({ _id: payload.id });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    });

  passport.use(JwtStrategy());
};

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err || !user?.role) {
      return res.status(401).json({ message: 'Unauthorized', errors: [info] });
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
};
