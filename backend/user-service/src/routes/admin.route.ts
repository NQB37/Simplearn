import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers);
router.patch('/users/:id/role', isAuthenticated, isAdmin, adminController.updateUserRole);
router.delete('/users/:id', isAuthenticated, isAdmin, adminController.deleteUser);

export default router;
