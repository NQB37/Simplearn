import MajorSubject, { IMajorSubject } from '../models/major-subject.model.js';

export const getCurriculumByMajor = async (
  majorId: string,
  typeOfStudy?: string,
): Promise<IMajorSubject[]> => {
  const filter: Record<string, string> = { majorId };
  if (typeOfStudy) filter.typeOfStudy = typeOfStudy;
  return MajorSubject.find(filter).populate('subjectId').sort({ studyYear: 1, semester: 1 });
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
