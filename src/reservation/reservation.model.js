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
    contact: { type: String, required: true },
    price: { type: Number, required: false },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model('reservation', reservationSchema);
