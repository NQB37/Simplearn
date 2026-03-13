import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service.js';

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.getSubjects();
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects', err);
    res.status(500).json({ error: 'Server error retrieving subjects' });
  }
};

export const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await subjectService.getSubjectById(
      req.params.id as string,
    );
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    console.error('Error fetching subject', err);
    res.status(500).json({ error: 'Server error retrieving subject' });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const newSubject = await subjectService.createSubject(req.body);
    res.status(201).json(newSubject);
  } catch (err: any) {
    console.error('Error creating subject', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const updatedSubject = await subjectService.updateSubject(
      req.params.id as string,
      req.body,
    );
    if (!updatedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(updatedSubject);
  } catch (err: any) {
    console.error('Error updating subject', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const deletedSubject = await subjectService.deleteSubject(
      req.params.id as string,
    );
    if (!deletedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting subject', err);
    res.status(400).json({ error: 'Server error deleting subject' });
  }
};
