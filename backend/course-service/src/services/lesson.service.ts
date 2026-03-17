import Lesson, { ILesson, IContentBlock } from '../models/lesson.model.js';

export const getLessons = async (moduleId: string): Promise<ILesson[]> => {
  return Lesson.find({ moduleId }).sort({ order: 1 });
};

export const createLesson = async (data: {
  moduleId: string;
  title: string;
}): Promise<ILesson> => {
  const last = await Lesson.findOne({ moduleId: data.moduleId }).sort({ order: -1 });
  const order = last ? last.order + 1 : 0;
  return Lesson.create({ ...data, order, contents: [] });
};

export const updateLesson = async (
  lessonId: string,
  data: Partial<Pick<ILesson, 'title' | 'contents'>>,
): Promise<ILesson | null> => {
  return Lesson.findByIdAndUpdate(lessonId, data, { new: true });
};

export const deleteLesson = async (lessonId: string): Promise<ILesson | null> => {
  return Lesson.findByIdAndDelete(lessonId);
};
