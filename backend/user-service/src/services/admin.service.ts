import { User } from '../models/user.model.js';
import { Profile } from '../models/profile.model.js';
import type { CreateUserInput } from '../validators/create-user.validator.js';

export interface GetAllUsersFilters {
  role?: string;
  facultyId?: string;
  majorId?: string;
  typeOfStudy?: string;
  startYear?: string;
}

export const getAllUsers = async (filters: GetAllUsersFilters = {}) => {
  const matchStage: Record<string, any> = {};
  if (filters.role) matchStage.role = filters.role.toUpperCase();

  const results = await User.aggregate([
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'profile',
      },
    },
    { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'faculties',
        localField: 'profile.studentData.facultyId',
        foreignField: '_id',
        as: 'studentFaculty',
      },
    },
    {
      $lookup: {
        from: 'majors',
        localField: 'profile.studentData.majorId',
        foreignField: '_id',
        as: 'studentMajor',
      },
    },
    {
      $lookup: {
        from: 'faculties',
        localField: 'profile.instructorData.facultyId',
        foreignField: '_id',
        as: 'instructorFaculty',
      },
    },
    {
      $lookup: {
        from: 'majors',
        localField: 'profile.instructorData.majorId',
        foreignField: '_id',
        as: 'instructorMajor',
      },
    },
    {
      $project: {
        id: { $toString: '$_id' },
        email: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        picture: 1,
        studentData: {
          $cond: {
            if: { $ifNull: ['$profile.studentData', false] },
            then: {
              formOfStudy: '$profile.studentData.formOfStudy',
              typeOfStudy: '$profile.studentData.typeOfStudy',
              startYear: '$profile.studentData.startYear',
              facultyId: {
                $cond: {
                  if: { $gt: [{ $size: '$studentFaculty' }, 0] },
                  then: { $arrayElemAt: [{ $map: { input: '$studentFaculty', as: 'f', in: { _id: '$$f._id', name: '$$f.name' } } }, 0] },
                  else: '$$REMOVE',
                },
              },
              majorId: {
                $cond: {
                  if: { $gt: [{ $size: '$studentMajor' }, 0] },
                  then: { $arrayElemAt: [{ $map: { input: '$studentMajor', as: 'm', in: { _id: '$$m._id', name: '$$m.name' } } }, 0] },
                  else: '$$REMOVE',
                },
              },
            },
            else: '$$REMOVE',
          },
        },
        instructorData: {
          $cond: {
            if: { $ifNull: ['$profile.instructorData', false] },
            then: {
              facultyId: {
                $cond: {
                  if: { $gt: [{ $size: '$instructorFaculty' }, 0] },
                  then: { $arrayElemAt: [{ $map: { input: '$instructorFaculty', as: 'f', in: { _id: '$$f._id', name: '$$f.name' } } }, 0] },
                  else: '$$REMOVE',
                },
              },
              majorId: {
                $cond: {
                  if: { $gt: [{ $size: '$instructorMajor' }, 0] },
                  then: { $arrayElemAt: [{ $map: { input: '$instructorMajor', as: 'm', in: { _id: '$$m._id', name: '$$m.name' } } }, 0] },
                  else: '$$REMOVE',
                },
              },
            },
            else: '$$REMOVE',
          },
        },
      },
    },
  ]);

  // Apply profile-level filters post-aggregation (simple approach)
  return results.filter((u) => {
    const sd = u.studentData;
    const id = u.instructorData;
    if (filters.typeOfStudy && sd?.typeOfStudy !== filters.typeOfStudy) return false;
    if (filters.startYear && sd?.startYear !== Number(filters.startYear)) return false;
    if (filters.facultyId) {
      const fid = filters.facultyId;
      const studentMatch = sd?.facultyId?._id?.toString() === fid;
      const instructorMatch = id?.facultyId?._id?.toString() === fid;
      if (!studentMatch && !instructorMatch) return false;
    }
    if (filters.majorId) {
      const mid = filters.majorId;
      const studentMatch = sd?.majorId?._id?.toString() === mid;
      const instructorMatch = id?.majorId?._id?.toString() === mid;
      if (!studentMatch && !instructorMatch) return false;
    }
    return true;
  });
};

export const updateUserRole = async (id: string, role: string) => {
  return User.findByIdAndUpdate(id, { role }, { new: true });
};

export const updateUserStatus = async (id: string, status: string) => {
  return User.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
};

const DEFAULT_PASSWORD = 'simplearn123';

export const createUser = async (data: CreateUserInput) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const err: any = new Error('User already exists');
    err.code = 'DUPLICATE_EMAIL';
    throw err;
  }

  const user = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: DEFAULT_PASSWORD,
    role: 'STUDENT',
    picture: data.picture,
  });
  await user.save();

  // Build profile data from personal fields + studentData
  const profileData: Record<string, any> = {};
  if (data.dateOfBirth) profileData.dateOfBirth = data.dateOfBirth;
  if (data.phone) profileData.phone = data.phone;
  if (data.address) profileData.address = data.address;
  if (data.studentData && Object.keys(data.studentData).length > 0) {
    profileData.studentData = data.studentData;
  }

  if (Object.keys(profileData).length > 0) {
    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: profileData },
      { upsert: true, new: true },
    );
  }

  return user;
};
