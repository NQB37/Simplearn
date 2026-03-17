import mongoose, { Schema } from 'mongoose';
const CourseSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    subjectId: { type: String, required: true },
    instructorId: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, {
    timestamps: true,
});
export default mongoose.model('Course', CourseSchema);
