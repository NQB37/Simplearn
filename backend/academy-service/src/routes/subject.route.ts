import express from 'express';
import {
  getSubjects,
  createSubject,
  bulkCreateSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subject.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

// Public / Protected Routes
router.get('/', getSubjects);
router.post(
  '/bulk',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  bulkCreateSubjects,
);
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
