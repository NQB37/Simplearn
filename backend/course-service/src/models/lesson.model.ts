import mongoose, { Document, Schema } from 'mongoose';

export interface IContentBlock {
  _id: string;
  type: 'text' | 'image' | 'document';
  // text
  body?: string;
  // image
  url?: string;
  altText?: string;
  // document
  path?: string;
  fullPath?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
}

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  order: number;
  contents: IContentBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>({
  type: { type: String, enum: ['text', 'image', 'document'], required: true },
  body: String,
  url: String,
  altText: String,
  path: String,
  fullPath: String,
  originalName: String,
  size: Number,
  mimeType: String,
});

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    contents: { type: [ContentBlockSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<ILesson>('Lesson', LessonSchema);
