import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

export const getUserById = async (userId: string) => {
  return User.findById(userId).select('-password');
};

export const updateProfile = async (
  userId: string,
  name: string,
  picture: string,
) => {
  return User.findByIdAndUpdate(
    userId,
    { name, picture },
    { new: true, runValidators: true },
  ).select('-password');
};

export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) return { message: 'User not found', status: 404 };
  if (!user.password)
    return {
      message: 'User has no password set (e.g., OAuth)',
      status: 400,
    };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { message: 'Incorrect current password', status: 400 };

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: 'Password updated successfully', status: 200 };
};
