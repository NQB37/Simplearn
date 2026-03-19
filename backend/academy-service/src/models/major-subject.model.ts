import mongoose, { Schema, Document } from 'mongoose';

export interface IMajorSubject extends Document {
  majorId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  studyYear: number;
  semester: 'first' | 'second' | 'summer';
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MajorSubjectSchema: Schema = new Schema(
  {
    majorId: { type: Schema.Types.ObjectId, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    studyYear: { type: Number, required: true },
    semester: {
      type: String,
      enum: ['first', 'second', 'summer'],
      required: true,
    },
    isMandatory: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

MajorSubjectSchema.index(
  { majorId: 1, subjectId: 1, studyYear: 1, semester: 1 },
  { unique: true },
);

export default mongoose.model<IMajorSubject>('MajorSubject', MajorSubjectSchema);
