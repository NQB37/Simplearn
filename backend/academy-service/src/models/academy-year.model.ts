import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicYearSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAcademicYear>(
  'AcademicYear',
  AcademicYearSchema,
);
