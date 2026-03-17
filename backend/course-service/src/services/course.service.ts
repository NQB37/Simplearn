import Course, { ICourse } from '../models/course.model.js';

export const getCourses = async (): Promise<ICourse[]> => {
  return Course.find().sort({ createdAt: -1 });
};

export const getCourseBySlug = async (slug: string): Promise<ICourse | null> => {
  return Course.findOne({ slug });
};

export const createCourse = async (data: {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  instructorId: string;
}): Promise<ICourse> => {
  const newCourse = new Course(data);
  return newCourse.save();
};

export const updateCourse = async (
  id: string,
  data: Partial<Pick<ICourse, 'title' | 'description' | 'subjectId' | 'status'>>,
): Promise<ICourse | null> => {
  return Course.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCourse = async (id: string): Promise<ICourse | null> => {
  return Course.findByIdAndDelete(id);
};
