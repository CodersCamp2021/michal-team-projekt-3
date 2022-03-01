import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },

    //todo refs from user
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    lastname: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      max: 255,
      min: 6,
    },
    //todo refs from object
    title: {
      type: String,
      required: true,
    },
    localisation: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model('reservation', reservationSchema);
