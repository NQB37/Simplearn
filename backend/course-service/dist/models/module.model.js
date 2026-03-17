import mongoose, { Schema } from 'mongoose';
const ModuleSchema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
}, {
    timestamps: true,
});
export default mongoose.model('Module', ModuleSchema);
