import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as adminProfileController from '../controllers/admin.profile.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers);
router.patch('/users/:id/role', isAuthenticated, isAdmin, adminController.updateUserRole);
router.delete('/users/:id', isAuthenticated, isAdmin, adminController.deleteUser);

// Admin: manage any user's extended profile
router.get('/users/:id/profile', isAuthenticated, isAdmin, adminProfileController.getUserProfile);
router.patch('/users/:id/profile', isAuthenticated, isAdmin, validateRequest(updateProfileSchema), adminProfileController.updateUserProfile);

// Vocabulary: Fields of Study (public read, admin write)
router.get('/vocabulary/fields', isAuthenticated, adminProfileController.getFieldsOfStudy);
router.post('/vocabulary/fields', isAuthenticated, isAdmin, adminProfileController.createFieldOfStudy);
router.delete('/vocabulary/fields/:id', isAuthenticated, isAdmin, adminProfileController.deleteFieldOfStudy);

// Vocabulary: Majors (public read, admin write)
router.get('/vocabulary/majors', isAuthenticated, adminProfileController.getMajors);
router.post('/vocabulary/majors', isAuthenticated, isAdmin, adminProfileController.createMajor);
router.delete('/vocabulary/majors/:id', isAuthenticated, isAdmin, adminProfileController.deleteMajor);

export default router;
