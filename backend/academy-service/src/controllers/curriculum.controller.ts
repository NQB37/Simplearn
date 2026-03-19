import { Request, Response } from 'express';
import * as curriculumService from '../services/curriculum.service.js';

export const getCurriculum = async (req: Request, res: Response) => {
  try {
    const entries = await curriculumService.getCurriculumByMajor(req.params.majorId as string);
    res.json(entries);
  } catch (err: any) {
    console.error('Error fetching curriculum', err);
    res.status(500).json({ error: 'Server error retrieving curriculum' });
  }
};

export const addCurriculumEntry = async (req: Request, res: Response) => {
  try {
    const entry = await curriculumService.addMajorSubject(req.body);
    res.status(201).json(entry);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'This subject is already assigned to the major for that year and semester' });
      return;
    }
    console.error('Error adding curriculum entry', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteCurriculumEntry = async (req: Request, res: Response) => {
  try {
    const deleted = await curriculumService.removeMajorSubject(req.params.id as string);
    if (!deleted) {
      res.status(404).json({ error: 'Curriculum entry not found' });
      return;
    }
    res.json({ message: 'Curriculum entry removed' });
  } catch (err: any) {
    console.error('Error deleting curriculum entry', err);
    res.status(400).json({ error: err.message });
  }
};
