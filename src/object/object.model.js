import mongoose from 'mongoose';

const localisationSchema = new mongoose.Schema({
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
});

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
    localisation: localisationSchema,
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

    // todo ref z hosta
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

    lastOnline: {
      type: String,
      required: false,
    },

    //todo ref z usera

    photo: {
      type: String,
      required: false,
    },

    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },

    languages: {
      type: Array,
      required: false,
    },
  },

  { timestamps: true },
);

export const Object = mongoose.model('object', objectSchema);
