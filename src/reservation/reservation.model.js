import mongoose from 'mongoose';
import { PAYMENT_METHOD } from '../constants';

const reservationSchema = new mongoose.Schema(
  {
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', required: true },
    object: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'object',
      required: true,
    },
    message: { type: String, required: false },
    payment: {
      type: String,
      enum: [
        PAYMENT_METHOD.PAYPAL,
        PAYMENT_METHOD.CREDIT_CARD,
        PAYMENT_METHOD.PAYING_ON_PLACE,
      ],
      required: true,
    },
    contact: {
      name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
      },
      lastName: { type: String, required: true, min: 6, max: 255 },
      email: { type: String, trim: true, required: true, min: 6, max: 255 },
      phone: { type: Number, required: true },
    },
    price: { type: Number, required: false },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model('reservation', reservationSchema);
