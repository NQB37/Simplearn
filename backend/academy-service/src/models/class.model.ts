import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  code: string;
  roomId: mongoose.Types.ObjectId;
  schedules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
  subjectId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  maxCapacity: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
  {
    code: { type: String, required: true, trim: true, unique: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    schedules: [
      {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        startTime: { type: String, required: true }, // '08:00'
        endTime: { type: String, required: true }, // '10:00'
      },
    ],
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    maxCapacity: { type: Number, required: true, default: 30 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IClass>('Class', ClassSchema);
