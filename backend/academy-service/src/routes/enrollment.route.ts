import express, { Request, Response, NextFunction } from 'express';
import {
  getEligibleSubjects,
  bulkEnroll,
  getMyEnrollments,
  enrollStudent,
} from '../controllers/enrollment.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

const enrollSchema = z.object({
  classId: z.string().min(1),
});

const bulkEnrollSchema = z.object({
  subjectIds: z.array(z.string().min(1)),
  academicYearId: z.string().min(1),
});

function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}

// GET /api/v1/enrollments/me — current student's enrolled classes with full shift/room data
router.get(
  '/me',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  getMyEnrollments,
);

router.get(
  '/eligible',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  getEligibleSubjects,
);

// POST /api/v1/enrollments — enroll in a class by classId
router.post(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  validate(enrollSchema),
  enrollStudent,
);

router.post(
  '/bulk',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  validate(bulkEnrollSchema),
  bulkEnroll,
);

export default router;
