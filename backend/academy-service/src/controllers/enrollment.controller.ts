import { Request, Response } from 'express';
import * as enrollmentService from '../services/enrollment.service.js';

export const getMyEnrollments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id ?? req.user?.userId;
    const enrollments = await enrollmentService.getMyEnrollments(userId);
    res.json(enrollments);
  } catch (err: any) {
    console.error('Error fetching enrollments', err);
    res.status(500).json({ error: err.message });
  }
};

export const getEligibleSubjects = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']!.split(' ')[1];
    const result = await enrollmentService.getEligibleSubjects(token);
    res.json(result);
  } catch (err: any) {
    console.error('Error fetching eligible subjects', err);
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
};

export const bulkEnroll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id ?? req.user?.userId;
    const { subjectIds, academicYearId } = req.body;
    const enrollments = await enrollmentService.bulkEnroll(userId, subjectIds, academicYearId);
    res.json({ enrolled: enrollments });
  } catch (err: any) {
    console.error('Error bulk enrolling', err);
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
};
