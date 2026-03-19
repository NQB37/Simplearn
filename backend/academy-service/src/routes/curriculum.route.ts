import express, { Request, Response, NextFunction } from 'express';
import {
  getCurriculum,
  addCurriculumEntry,
  deleteCurriculumEntry,
} from '../controllers/curriculum.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

const addCurriculumSchema = z.object({
  majorId: z.string().min(1),
  subjectId: z.string().min(1),
  studyYear: z.number().int().min(1),
  semester: z.enum(['first', 'second', 'summer']),
  isMandatory: z.boolean().optional(),
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
  '/:majorId',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  getCurriculum,
);

router.post(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  validate(addCurriculumSchema),
  addCurriculumEntry,
);

router.delete(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  deleteCurriculumEntry,
);

export default router;
