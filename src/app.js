import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import { StartRouter } from './routes/start.js';
import passport from 'passport';
import { AuthRouter } from './auth/auth.router.js';
import { JwtConfig } from './auth/passport.js';
import express from 'express';
export const app = express();

app.use(passport.initialize());
JwtConfig(passport);
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', StartRouter);
app.use('/auth', AuthRouter);
