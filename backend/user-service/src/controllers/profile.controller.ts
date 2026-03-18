import { Request, Response } from 'express';
import * as profileService from '../services/profile.service.js';
import type { UpdateProfileInput } from '../validators/profile.validator.js';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const profile = await profileService.getProfileByUserId(userId);
    res.json(profile ?? {});
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const data: UpdateProfileInput = req.body;
    const profile = await profileService.updateProfile(userId, data);
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
