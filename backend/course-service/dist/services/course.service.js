import Course from '../models/course.model.js';
export const getCourses = async () => {
    return Course.find().sort({ createdAt: -1 });
};
export const getCourseBySlug = async (slug) => {
    return Course.findOne({ slug });
};
export const createCourse = async (data) => {
    const newCourse = new Course(data);
    return newCourse.save();
};
export const updateCourse = async (id, data) => {
    return Course.findByIdAndUpdate(id, data, { new: true });
};
export const deleteCourse = async (id) => {
    return Course.findByIdAndDelete(id);
};
