import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  instructorId: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    subjectId: { type: String, required: true },
    instructorId: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICourse>('Course', CourseSchema);
