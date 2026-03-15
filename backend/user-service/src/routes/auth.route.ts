import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/google', authController.googleLogin);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', isAuthenticated, authController.getMe);

export default router;
