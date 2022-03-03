import { User } from './user.model';
import mongoose from 'mongoose';

describe('User model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = User.schema.obj.name;
      expect(name).toEqual({
        type: String,
        required: true,
        min: 6,
        max: 255,
      });
    });

    test('lastName', () => {
      const lastName = User.schema.obj.lastName;
      expect(lastName).toEqual({
        type: String,
        required: true,
        min: 6,
        max: 255,
      });
    });

    test('email', () => {
      const email = User.schema.obj.email;
      expect(email).toEqual({
        type: String,
        required: true,
        unique: true,
        trim: true,
        max: 255,
        min: 6,
      });
    });

    test('password', () => {
      const password = User.schema.obj.password;
      expect(password).toEqual({
        type: String,
        required: true,
        max: 255,
        min: 8,
      });
    });

    test('dob', () => {
      const dob = User.schema.obj.dob;
      expect(dob).toEqual({
        type: Date,
        required: true,
      });
    });

    test('photo', () => {
      const photo = User.schema.obj.photo;
      expect(photo).toEqual({
        type: String,
        required: false,
      });
    });

    test('languages', () => {
      const languages = User.schema.obj.languages;
      expect(languages).toEqual({
        type: Array,
        required: false,
      });
    });

    test('responseTime', () => {
      const responseTime = User.schema.obj.responseTime;
      expect(responseTime).toEqual({
        type: Date,
        required: false,
      });
    });

    test('rating', () => {
      const rating = User.schema.obj.rating;
      expect(rating).toEqual({
        type: Number,
        required: false,
      });
    });

    test('hostFrom', () => {
      const hostFrom = User.schema.obj.hostFrom;
      expect(hostFrom).toEqual({
        type: Date,
        required: false,
      });
    });

    test('lastOnline', () => {
      const lastOnline = User.schema.obj.lastOnline;
      expect(lastOnline).toEqual({
        type: String,
        required: false,
      });
    });

    test('reservation', () => {
      const reservation = User.schema.obj.reservation;
      expect(reservation).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'reservation',
        required: false,
      });
    });
  });
});
