import Class, { IClass } from '../models/class.model.js';

export const getClasses = async () => {
  return Class.find().populate('subjectId academicYearId roomId');
};

export const createClass = async (data: Partial<IClass>) => {
  const newClass = new Class(data);
  return newClass.save();
};
export const getClassById = async (id: string) => {
  return Class.findById(id).populate('subjectId academicYearId roomId');
};

export const updateClass = async (id: string, data: Partial<IClass>) => {
  return Class.findByIdAndUpdate(id, data, { new: true }).populate(
    'subjectId academicYearId roomId',
  );
};

export const deleteClass = async (id: string) => {
  return Class.findByIdAndDelete(id);
};
