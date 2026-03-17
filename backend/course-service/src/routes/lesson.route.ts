import express from 'express';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller.js';
import { config } from '../config/env.config.js';

const router = express.Router({ mergeParams: true });
const JWT_SECRET = config.jwtSecret;

router.get('/', requireAuth(JWT_SECRET), getLessons);
router.post('/', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), createLesson);
router.put('/:lessonId', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), updateLesson);
router.delete('/:lessonId', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), deleteLesson);

export default router;
