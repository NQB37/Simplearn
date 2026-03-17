import express from 'express';
import { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse, } from '../controllers/course.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
const router = express.Router();
const JWT_SECRET = config.jwtSecret;
// Public routes
router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
// Protected routes
router.post('/', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), createCourse);
router.put('/:id', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), updateCourse);
router.delete('/:id', requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET), deleteCourse);
export default router;
