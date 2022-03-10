import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { USER_ROLE } from '../constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    lastName: {
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
      immutable: true,
    },
    photo: {
      type: String,
      required: false,
    },
    languages: {
      type: Array,
      required: false,
    },
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
    reservation: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'reservation',
      required: false,
    },
    role: {
      type: String,
      enum: [USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.HOST],
      default: USER_ROLE.USER,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(user.password, salt);
      user.password = hashed;
    } catch (e) {
      next(e);
    }
  } else {
    next();
  }
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const user = this;
  if (user._update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(user._update.password, salt);
      this._update.password = hashed;
    } catch (e) {
      return next(e);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  if (isMatch) return true;
  return false;
};

userSchema.statics.selectFields = function (user) {
  const userObject = user?.toObject();
  const { createdAt, updatedAt, password, ...restUserData } = userObject;
  return restUserData;
};

export const User = mongoose.model('user', userSchema);
