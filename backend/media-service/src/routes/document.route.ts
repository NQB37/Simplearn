import express from 'express';
import { uploadDocument, deleteDocument, getDocumentUrl } from '../controllers/document.controller.js';
import { requireAuth, requireRole } from '@simplearn/middlewares';
import { config } from '../config/env.config.js';
import { documentUpload } from '../middleware/upload.middleware.js';

const router = express.Router();
const JWT_SECRET = config.jwtSecret;

router.post(
  '/upload',
  requireAuth(JWT_SECRET),
  requireRole(['instructor', 'admin'], JWT_SECRET),
  documentUpload,
  uploadDocument,
);

router.delete(
  '/',
  requireAuth(JWT_SECRET),
  requireRole(['instructor', 'admin'], JWT_SECRET),
  deleteDocument,
);

router.get(
  '/url',
  requireAuth(JWT_SECRET),
  getDocumentUrl,
);

export default router;
