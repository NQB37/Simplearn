import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.get('/profile', isAuthenticated, userController.getProfile);
router.patch('/profile', isAuthenticated, validateRequest(updateProfileSchema), userController.updateProfile);

export default router;
