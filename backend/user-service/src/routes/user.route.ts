import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { updateProfileSchema as updateBasicProfileSchema } from '../validators/auth.validator.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.get('/profile', isAuthenticated, userController.getProfile);
router.patch('/profile', isAuthenticated, validateRequest(updateBasicProfileSchema), userController.updateProfile);

router.get('/profile/extended', isAuthenticated, profileController.getProfile);
router.patch('/profile/extended', isAuthenticated, validateRequest(updateProfileSchema), profileController.updateProfile);

export default router;
