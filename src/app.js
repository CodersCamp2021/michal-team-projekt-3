import 'dotenv/config';
import morgan from 'morgan';
import { StartRouter } from './routes/start.js';
import { OfferRouter } from './offer/offer.router.js';
import passport from 'passport';
import { AuthRouter } from './auth/auth.router.js';
import { JwtConfig } from './auth/passport.js';
import { ReservationRouter } from './reservation/reservation.router.js';
import express from 'express';
import cors from 'cors';
import { UserRouter } from './user/user.router.js';
export const app = express();

const corsOptions = {
  origin: [process.env.FE_URL],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());
JwtConfig();
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', StartRouter);
app.use('/auth', AuthRouter);
app.use('/reservation', ReservationRouter);
app.use('/offer', OfferRouter);
app.use('/user', UserRouter);
