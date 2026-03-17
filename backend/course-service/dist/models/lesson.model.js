import mongoose, { Schema } from 'mongoose';
const ContentBlockSchema = new Schema({
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
const LessonSchema = new Schema({
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    contents: { type: [ContentBlockSchema], default: [] },
}, { timestamps: true });
export default mongoose.model('Lesson', LessonSchema);
