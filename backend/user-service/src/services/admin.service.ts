import { User } from '../models/user.model.js';
import { Profile } from '../models/profile.model.js';
import type { CreateUserInput } from '../validators/create-user.validator.js';

export const getAllUsers = async () => {
  return User.find()
    .select('id email name role status createdAt')
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
    name: data.name,
    email: data.email,
    password: DEFAULT_PASSWORD,
    role: 'STUDENT',
  });
  await user.save();

  if (data.studentData && Object.keys(data.studentData).length > 0) {
    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: { studentData: data.studentData } },
      { upsert: true, new: true },
    );
  }

  return user;
};
