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

// Vocabulary: Faculties
export const getFaculties = async (_req: Request, res: Response): Promise<any> => {
  try {
    const faculties = await profileService.getAllFaculties();
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createFaculty = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const faculty = await profileService.createFaculty(name.trim());
    res.status(201).json(faculty);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ message: 'Faculty already exists' });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteFaculty = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params['id'] as string;
    await profileService.deleteFaculty(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('Cannot delete')) return res.status(409).json({ message: error.message });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vocabulary: Majors
export const getMajors = async (req: Request, res: Response): Promise<any> => {
  try {
    const { facultyId } = req.query;
    const majors = await profileService.getMajorsByFaculty(
      typeof facultyId === 'string' ? facultyId : undefined,
    );
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createMajor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, facultyId } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!facultyId) return res.status(400).json({ message: 'facultyId is required' });
    const major = await profileService.createMajor(name.trim(), facultyId);
    res.status(201).json(major);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ message: 'Major already exists for this faculty' });
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
