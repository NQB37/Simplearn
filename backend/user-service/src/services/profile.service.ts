import mongoose from 'mongoose';
import { Profile } from '../models/profile.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Major } from '../models/major.model.js';
import type { UpdateProfileInput } from '../validators/profile.validator.js';

export const getProfileByUserId = async (userId: string) => {
  return Profile.findOne({ userId }).lean();
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const update: Record<string, unknown> = {};

  if (data.dateOfBirth !== undefined) update.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;
  if (data.sex !== undefined) update.sex = data.sex;
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.address !== undefined) update.address = data.address;
  if (data.studentData !== undefined) update.studentData = data.studentData;
  if (data.instructorData !== undefined) update.instructorData = data.instructorData;

  return Profile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: update },
    { upsert: true, new: true, runValidators: true },
  ).lean();
};

export const getAllFaculties = async () => {
  return Faculty.find().sort({ name: 1 }).lean();
};

export const createFaculty = async (name: string) => {
  return Faculty.create({ name });
};

export const deleteFaculty = async (id: string) => {
  const hasMajors = await Major.exists({ facultyId: id });
  if (hasMajors) {
    throw new Error('Cannot delete: remove dependent majors first.');
  }
  return Faculty.findByIdAndDelete(id);
};

export const getMajorsByFaculty = async (facultyId?: string) => {
  const filter = facultyId ? { facultyId } : {};
  return Major.find(filter).sort({ name: 1 }).lean();
};

export const createMajor = async (name: string, facultyId: string) => {
  return Major.create({ name, facultyId });
};

export const deleteMajor = async (id: string) => {
  return Major.findByIdAndDelete(id);
};
