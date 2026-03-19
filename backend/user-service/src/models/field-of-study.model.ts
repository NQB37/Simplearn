import mongoose, { Document, Schema } from 'mongoose';

export interface IFieldOfStudy extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const fieldOfStudySchema = new Schema<IFieldOfStudy>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

export const FieldOfStudy = mongoose.model<IFieldOfStudy>('FieldOfStudy', fieldOfStudySchema);
