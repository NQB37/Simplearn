import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

// Public / Protected Routes
router.get('/', getRooms);
router.get('/:id', getRoom);

// Admin / Teacher routes
router.post(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  createRoom,
);
router.put(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  updateRoom,
);
router.delete(
  '/:id',
  requireAuth(JWT_SECRET),
  requireRole(['admin'], JWT_SECRET),
  deleteRoom,
);

export default router;
