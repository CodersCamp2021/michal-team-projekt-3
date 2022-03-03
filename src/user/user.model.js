import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    surname: {
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
    password: {
      type: String,
      required: true,
      max: 255,
      min: 8,
    },
    dob: {
      type: Date,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    lastOnline: {
      type: Date,
      required: false,
    },
    //todo: ref do schematu host
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
    //todo: ref do schematu reservation
    reservations: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (e) {
      next(e);
    }
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  if (isMatch) return true;
  return false;
};

export const User = mongoose.model('User', UserSchema);
