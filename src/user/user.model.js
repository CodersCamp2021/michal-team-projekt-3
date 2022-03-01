import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    },
    photo: {
      type: String,
      required: false,
    },
    languages: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
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

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  if (isMatch) return true;
  return false;
};

export const User = mongoose.model('user', userSchema);
