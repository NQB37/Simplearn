import mongoose, { Document, Schema } from 'mongoose';

export interface IMajor extends Document {
  name: string;
  fieldOfStudyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const majorSchema = new Schema<IMajor>(
  {
    name: { type: String, required: true, trim: true },
    fieldOfStudyId: { type: Schema.Types.ObjectId, required: true, ref: 'FieldOfStudy' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

majorSchema.index({ name: 1, fieldOfStudyId: 1 }, { unique: true });

export const Major = mongoose.model<IMajor>('Major', majorSchema);
