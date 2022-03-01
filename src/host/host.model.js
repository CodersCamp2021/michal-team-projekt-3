import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema(
  {
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
  { timestamps: true },
);

export const Host = mongoose.model('host', hostSchema);
