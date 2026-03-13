import express from 'express';
import {
  getClasses,
  createClass,
  getClass,
  updateClass,
  deleteClass,
} from '../controllers/class.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Public / Protected Routes
router.get('/', getClasses);

// Admin / Teacher routes
router.get('/', getClasses);
router.get('/:id', getClass);
router.post(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['admin', 'instructor'], JWT_SECRET),
  createClass,
);
router.put(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin', 'instructor'], JWT_SECRET),
  updateClass,
);
router.delete(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  deleteClass,
);

export default router;
