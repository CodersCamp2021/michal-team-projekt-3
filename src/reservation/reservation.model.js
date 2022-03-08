import mongoose from 'mongoose';

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
    payment: { type: Array, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model('reservation', reservationSchema);
