import { Request, Response } from 'express';
import * as profileService from '../services/profile.service.js';
import type { UpdateProfileInput } from '../validators/profile.validator.js';

// Admin: get any user's extended profile
export const getUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params['id'] as string;
    const profile = await profileService.getProfileByUserId(id);
    res.json(profile ?? {});
  } catch (error) {
    console.error('Admin get user profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: update any user's extended profile
export const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params['id'] as string;
    const data: UpdateProfileInput = req.body;
    const profile = await profileService.updateProfile(id, data);
    res.json(profile);
  } catch (error) {
    console.error('Admin update user profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vocabulary: Fields of Study
export const getFieldsOfStudy = async (_req: Request, res: Response): Promise<any> => {
  try {
    const fields = await profileService.getAllFieldsOfStudy();
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createFieldOfStudy = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const field = await profileService.createFieldOfStudy(name.trim());
    res.status(201).json(field);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ message: 'Field of study already exists' });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteFieldOfStudy = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params['id'] as string;
    await profileService.deleteFieldOfStudy(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('Cannot delete')) return res.status(409).json({ message: error.message });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vocabulary: Majors
export const getMajors = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fieldId } = req.query;
    if (!fieldId || typeof fieldId !== 'string') {
      return res.status(400).json({ message: 'fieldId query param is required' });
    }
    const majors = await profileService.getMajorsByField(fieldId);
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createMajor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, fieldOfStudyId } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!fieldOfStudyId) return res.status(400).json({ message: 'fieldOfStudyId is required' });
    const major = await profileService.createMajor(name.trim(), fieldOfStudyId);
    res.status(201).json(major);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ message: 'Major already exists for this field' });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteMajor = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params['id'] as string;
    await profileService.deleteMajor(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
