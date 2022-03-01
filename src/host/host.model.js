import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema(
  {
    responseTime: {
      type: Date,
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

export const Host = mongoose.model('host', hostSchema);
