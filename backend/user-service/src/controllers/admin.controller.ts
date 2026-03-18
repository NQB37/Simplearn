import { Request, Response } from 'express';
import * as adminService from '../services/admin.service.js';
import type { CreateUserInput } from '../validators/create-user.validator.js';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await adminService.updateUserRole(id as string, role);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await adminService.updateUserStatus(id as string, status);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id as string);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const data: CreateUserInput = req.body;
    const user = await adminService.createUser(data);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
};
