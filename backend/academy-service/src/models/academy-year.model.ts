import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  name: string;
  semester: 'first' | 'second' | 'summer';
  startDate: Date;
  endDate: Date;
  enrollmentDeadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicYearSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    semester: {
      type: String,
      enum: ['first', 'second', 'summer'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    enrollmentDeadline: { type: Date },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

AcademicYearSchema.index({ name: 1, semester: 1 }, { unique: true });

export default mongoose.model<IAcademicYear>(
  'AcademicYear',
  AcademicYearSchema,
);
