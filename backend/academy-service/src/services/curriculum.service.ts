import MajorSubject, { IMajorSubject } from '../models/major-subject.model.js';

export const getCurriculumByMajor = async (
  majorId: string,
): Promise<IMajorSubject[]> => {
  return MajorSubject.find({ majorId }).populate('subjectId').sort({ studyYear: 1, semester: 1 });
};

export const addMajorSubject = async (data: {
  majorId: string;
  subjectId: string;
  studyYear: number;
  semester: 'first' | 'second' | 'summer';
  isMandatory?: boolean;
}): Promise<IMajorSubject> => {
  const entry = new MajorSubject(data);
  return entry.save();
};

export const removeMajorSubject = async (
  id: string,
): Promise<IMajorSubject | null> => {
  return MajorSubject.findByIdAndDelete(id);
};
