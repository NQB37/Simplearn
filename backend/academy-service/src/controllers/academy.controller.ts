import { Request, Response } from 'express';

import * as academyService from '../services/academy.service.js';

export const getAcademicYears = async (req: Request, res: Response) => {
  try {
    const years = await academyService.getAllAcademicYears();
    res.json(years);
  } catch (err: any) {
    console.error('Error fetching academic years', err);
    res.status(500).json({ error: 'Server error retrieving academic years' });
  }
};

export const createAcademicYear = async (req: Request, res: Response) => {
  try {
    const newYear = await academyService.createAcademicYear(req.body);
    res.status(201).json(newYear);
  } catch (err: any) {
    console.error('Error creating academic year', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateAcademicYear = async (req: Request, res: Response) => {
  try {
    const updatedYear = await academyService.updateAcademicYear(
      req.params.id as string,
      req.body,
    );
    if (!updatedYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }
    res.json(updatedYear);
  } catch (err: any) {
    console.error('Error updating academic year', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteAcademicYear = async (req: Request, res: Response) => {
  try {
    const deletedYear = await academyService.deleteAcademicYear(
      req.params.id as string,
    );
    if (!deletedYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }
    res.json({ message: 'Academic year deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting academic year', err);
    res.status(400).json({ error: 'Server error deleting academic year' });
  }
};

export const enrollUser = async (req: Request, res: Response) => {
  try {
    // Note: Enrollment model usage remains as is for now or could be moved to service later
    // For now keeping it simple as per request for Academic CRUD
    res
      .status(501)
      .json({ message: 'Enrollment logic not implemented in service' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
