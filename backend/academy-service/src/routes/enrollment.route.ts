import express, { Request, Response, NextFunction } from 'express';
import { getEligibleSubjects, bulkEnroll } from '../controllers/enrollment.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

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

router.get(
  '/eligible',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  getEligibleSubjects,
);

router.post(
  '/bulk',
  requireAuth(JWT_SECRET),
  requireRole(['student'], JWT_SECRET),
  validate(bulkEnrollSchema),
  bulkEnroll,
);

export default router;
