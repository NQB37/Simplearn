import mongoose, { Schema, Document } from 'mongoose';

export interface IShift extends Document {
  shiftId: number;
  startTime: string;
  endTime: string;
}

const ShiftSchema: Schema = new Schema({
  shiftId: { type: Number, required: true, unique: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

export default mongoose.model<IShift>('Shift', ShiftSchema);
