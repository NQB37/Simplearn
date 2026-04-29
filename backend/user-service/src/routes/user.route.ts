import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import { isAuthenticated, checkSuspended } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { updateProfileSchema as updateBasicProfileSchema, updatePasswordSchema } from '../validators/auth.validator.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.get('/profile', isAuthenticated, checkSuspended, userController.getProfile);
router.patch('/profile', isAuthenticated, checkSuspended, validateRequest(updateBasicProfileSchema), userController.updateProfile);

router.get('/profile/extended', isAuthenticated, checkSuspended, profileController.getProfile);
router.patch('/profile/extended', isAuthenticated, checkSuspended, validateRequest(updateProfileSchema), profileController.updateProfile);

router.patch('/password', isAuthenticated, checkSuspended, validateRequest(updatePasswordSchema), userController.updatePassword);

export default router;
