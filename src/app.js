import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import { StartRouter } from './routes/start.js';

const app = express();

mongoose.connect(process.env.MONGO_DB_URL, () => {
  console.log('Connected to MongoDB server');
});

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use('/', StartRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is listing on port', process.env.PORT);
});
