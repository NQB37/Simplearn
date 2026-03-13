import { User } from '../models/user.model.js';

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
