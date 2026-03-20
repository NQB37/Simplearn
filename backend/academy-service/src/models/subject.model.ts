import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  description: string;
  credits: number;
  optional: boolean;
  classIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true },
    description: { type: String },
    credits: { type: Number, required: true, default: 3 },
    optional: { type: Boolean, default: false },
    classIds: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);
