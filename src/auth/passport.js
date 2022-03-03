import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../user/user.model.js';

export const JwtConfig = (passport) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  const JwtStrategy = () =>
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({ id: payload.id });
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
