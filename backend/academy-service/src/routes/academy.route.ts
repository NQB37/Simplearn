import express, { Request, Response, NextFunction } from 'express';
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  enrollUser,
} from '../controllers/academy.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

const semesterEnum = z.enum(['first', 'second', 'summer']);

const createAcademicYearSchema = z.object({
  name: z.string().min(1),
  semester: semesterEnum,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  enrollmentDeadline: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

const updateAcademicYearSchema = createAcademicYearSchema.partial();

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

router.get(
  '/academic-years',
  requireAuth(JWT_SECRET),
  requireRole(['admin', 'instructor', 'student'], JWT_SECRET),
  getAcademicYears,
);
router.post(
  '/academic-years',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  validate(createAcademicYearSchema),
  createAcademicYear,
);
router.put(
  '/academic-years/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  validate(updateAcademicYearSchema),
  updateAcademicYear,
);
router.delete(
  '/academic-years/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  deleteAcademicYear,
);
router.post(
  '/enroll',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  enrollUser,
);

export default router;
