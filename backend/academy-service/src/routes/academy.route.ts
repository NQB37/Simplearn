import express from 'express';
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  enrollUser,
} from '../controllers/academy.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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
  createAcademicYear,
);
router.put(
  '/academic-years/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
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
