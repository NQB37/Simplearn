import Lesson from '../models/lesson.model.js';
export const getLessons = async (moduleId) => {
    return Lesson.find({ moduleId }).sort({ order: 1 });
};
export const createLesson = async (data) => {
    const last = await Lesson.findOne({ moduleId: data.moduleId }).sort({ order: -1 });
    const order = last ? last.order + 1 : 0;
    return Lesson.create({ ...data, order, contents: [] });
};
export const updateLesson = async (lessonId, data) => {
    return Lesson.findByIdAndUpdate(lessonId, data, { new: true });
};
export const deleteLesson = async (lessonId) => {
    return Lesson.findByIdAndDelete(lessonId);
};
