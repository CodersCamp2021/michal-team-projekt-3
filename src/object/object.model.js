import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    accomodationType: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    localisation: {
      address: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    amenities: {
      type: Array,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    images: { type: Array, required: false },
  },
  { timestamps: true },
);

export const Object = new mongoose.model('object', objectSchema);
