import express from 'express';
import {
  getSubjects,
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subject.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Public / Protected Routes
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  createSubject,
);
router.put(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  updateSubject,
);
router.delete(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  deleteSubject,
);

export default router;
