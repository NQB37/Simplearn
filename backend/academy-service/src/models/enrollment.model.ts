import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate enrollment for the same subject in the same academic year (ENRL-03)
EnrollmentSchema.index({ userId: 1, academicYearId: 1, subjectId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
