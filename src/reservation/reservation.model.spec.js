import { Reservation } from './reservation.model';
import mongoose from 'mongoose';

describe('Reservation model', () => {
  describe('schema', () => {
    test('dateStart', () => {
      const dateStart = Reservation.schema.obj.dateStart;
      expect(dateStart).toEqual({ type: Date, required: true });
    });

    test('dateEnd', () => {
      const dateEnd = Reservation.schema.obj.dateEnd;
      expect(dateEnd).toEqual({ type: Date, required: true });
    });

    test('object', () => {
      const object = Reservation.schema.obj.object;
      expect(object).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'object',
        required: true,
      });
    });
  });
});
