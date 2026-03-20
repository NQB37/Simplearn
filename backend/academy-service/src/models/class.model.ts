import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  code: string;
  roomId: mongoose.Types.ObjectId;
  schedules: Array<{ dayOfWeek: number; shiftId: number }>;
  subjectId: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
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
        dayOfWeek: { type: Number, required: true, min: 1, max: 5 },
        shiftId: { type: Number, required: true, min: 1, max: 7 },
      },
    ],
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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

// Prevent the same room from being double-booked at the same day/shift within an academic year
ClassSchema.index(
  {
    roomId: 1,
    'schedules.dayOfWeek': 1,
    'schedules.shiftId': 1,
    academicYearId: 1,
  },
  { unique: true, sparse: true },
);

// Prevent an instructor from being double-booked at the same day/shift within an academic year
ClassSchema.index(
  {
    instructorId: 1,
    'schedules.dayOfWeek': 1,
    'schedules.shiftId': 1,
    academicYearId: 1,
  },
  { unique: true, sparse: true },
);

export default mongoose.model<IClass>('Class', ClassSchema);
