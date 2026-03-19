import { User } from '../models/user.model.js';
import { Profile } from '../models/profile.model.js';
import type { CreateUserInput } from '../validators/create-user.validator.js';

export const getAllUsers = async () => {
  return User.find()
    .select('id email firstName lastName role status createdAt')
    .sort({ createdAt: -1 });
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
