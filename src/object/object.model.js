import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    description: {
      type: String,
      required: false,
    },
    localisation: {
      type: String,
      required: true,
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
      required: false,
    },
    images: { type: Array, required: false },

    // todo ref z schematu hosta
    hostInfo: {
      responseTime: {
        type: Date,
        required: false,
      },
      languages: {
        type: Array,
        required: false,
      },
      rating: {
        type: Number,
        required: false,
      },
      hostFrom: {
        type: Date,
        required: false,
      },
    },
  },
  { timestamps: true },
);

export const Object = mongoose.model('object', objectSchema);
