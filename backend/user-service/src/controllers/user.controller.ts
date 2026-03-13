import { Request, Response } from 'express';
import * as userService from '../services/user.service.js';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, picture } = req.body;
    const userId = (req as any).user.id;

    const user = await userService.updateProfile(userId, name, picture);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    const result = await userService.updatePassword(
      userId,
      currentPassword,
      newPassword,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
