import express from 'express';
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
} from '../controllers/module.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';

const router = express.Router({ mergeParams: true });
const JWT_SECRET = config.jwtSecret;

// All module routes are protected - instructors and admins only
router.use(requireAuth(JWT_SECRET), requireRole(['instructor', 'admin'], JWT_SECRET));

// Module routes
router.get('/', getModules);
router.post('/', createModule);

// Reorder route must come before /:moduleId routes to avoid conflicts
router.put('/reorder', reorderModules);

router.put('/:moduleId', updateModule);
router.delete('/:moduleId', deleteModule);

export default router;