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
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const FieldOfStudy = mongoose.model<IFieldOfStudy>('FieldOfStudy', fieldOfStudySchema);
