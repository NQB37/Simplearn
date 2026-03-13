import Subject, { ISubject } from '../models/subject.model.ts';

export const getSubjects = async () => {
  return Subject.find().populate('classIds');
};

export const createSubject = async (data: Partial<ISubject>) => {
  const newSubject = new Subject(data);
  return newSubject.save();
};
export const getSubjectById = async (id: string) => {
  return Subject.findById(id).populate('classIds');
};

export const updateSubject = async (id: string, data: Partial<ISubject>) => {
  return Subject.findByIdAndUpdate(id, data, { new: true }).populate(
    'classIds',
  );
};

export const deleteSubject = async (id: string) => {
  return Subject.findByIdAndDelete(id);
};
