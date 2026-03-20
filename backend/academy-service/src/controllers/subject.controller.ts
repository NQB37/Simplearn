import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service.js';

const extractCurriculumFields = (body: any): subjectService.CurriculumFields | undefined => {
  const { majorId, studyYear, semester, isMandatory, typeOfStudy } = body;
  if (!majorId && studyYear === undefined && !semester && isMandatory === undefined && !typeOfStudy) return undefined;
  return { majorId, studyYear, semester, isMandatory, typeOfStudy };
};

const extractSubjectFields = (body: any) => {
  const { majorId: _majorId, studyYear: _studyYear, semester: _semester, isMandatory: _isMandatory, typeOfStudy: _typeOfStudy, ...subjectData } = body;
  return subjectData;
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const { typeOfStudy, majorId } = req.query as { typeOfStudy?: string; majorId?: string };
    const subjects = await subjectService.getSubjects({ typeOfStudy, majorId });
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects', err);
    res.status(500).json({ error: 'Server error retrieving subjects' });
  }
};

export const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id as string);
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
    const subjectData = extractSubjectFields(req.body);
    const curriculum = extractCurriculumFields(req.body);
    const newSubject = await subjectService.createSubject(subjectData, curriculum);
    res.status(201).json(newSubject);
  } catch (err: any) {
    console.error('Error creating subject', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const subjectData = extractSubjectFields(req.body);
    const curriculum = extractCurriculumFields(req.body);
    const updatedSubject = await subjectService.updateSubject(
      req.params.id as string,
      subjectData,
      curriculum,
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

export const bulkCreateSubjects = async (req: Request, res: Response) => {
  try {
    const { subjects } = req.body;
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'Request body must contain a non-empty "subjects" array' });
    }
    const result = await subjectService.bulkCreateSubjects(subjects);
    res.json(result);
  } catch (err) {
    console.error('Error bulk creating subjects', err);
    res.status(500).json({ error: 'Server error during bulk import' });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const deletedSubject = await subjectService.deleteSubject(req.params.id as string);
    if (!deletedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting subject', err);
    res.status(400).json({ error: 'Server error deleting subject' });
  }
};
