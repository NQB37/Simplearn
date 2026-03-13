import AcademicYear, { IAcademicYear } from '../models/academy-year.model.js';

export const getAllAcademicYears = async (): Promise<IAcademicYear[]> => {
  return AcademicYear.find().sort({ name: 1 });
};

export const getAcademicYearById = async (
  id: string,
): Promise<IAcademicYear | null> => {
  return AcademicYear.findById(id);
};

export const createAcademicYear = async (
  data: Partial<IAcademicYear>,
): Promise<IAcademicYear> => {
  const newYear = new AcademicYear(data);
  return newYear.save();
};

export const updateAcademicYear = async (
  id: string,
  data: Partial<IAcademicYear>,
): Promise<IAcademicYear | null> => {
  return AcademicYear.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAcademicYear = async (
  id: string,
): Promise<IAcademicYear | null> => {
  return AcademicYear.findByIdAndDelete(id);
};
