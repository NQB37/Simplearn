import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  subjectId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

EnrollmentSchema.index({ userId: 1, academicYearId: 1, subjectId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
