import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  classId: mongoose.Types.ObjectId;
  userId: string;
  role: 'student' | 'instructor';
  status: 'active' | 'dropped';
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    userId: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true },
    status: { type: String, enum: ['active', 'dropped'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

EnrollmentSchema.index({ classId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
